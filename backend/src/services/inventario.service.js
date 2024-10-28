"use strict";
import Inventario from "../entity/inventario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Item from "../entity/item.entity.js";
import CodigoBarras from "../entity/cBarras.entity.js";

export async function getItemService(query) {
  try {
    const { id, cBarras, nombre } = query;
    const itemRepository = AppDataSource.getRepository(Item);

   
    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (cBarras) whereCondition.cBarras = cBarras;
    if (nombre) whereCondition.nombre = nombre;

    console.log("Condición de búsqueda:", whereCondition); 

   
    const itemFound = await itemRepository.findOne({
      where: whereCondition,
      relations: ["codigosBarras"], 
    });

    if (!itemFound) return [null, "Artículo no encontrado"];

    return [itemFound, null];
  } catch (error) {
    console.error("Error al obtener el artículo de inventario:", error);
    return [null, "Error interno del servidor"];
  }
}



export async function createInventarioService(body) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    // Verifica si ya existe un inventario con el mismo nombre
    const duplicateInventario = await inventarioRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (duplicateInventario) {
      return [null, "Ya existe un inventario con el mismo nombre"];
    }

    // Crea un nuevo inventario
    const nuevoInventario = inventarioRepository.create({
      nombre: body.nombre,
      descripcion: body.descripcion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guarda el nuevo inventario en la base de datos
    await inventarioRepository.save(nuevoInventario);

    return [nuevoInventario, null];
  } catch (error) {
    console.error("Error al crear el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function getInventarioByIdService(query) {
  try {
    const { id, nombre } = query;
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    // Construye la condición de búsqueda dinámica según los parámetros proporcionados
    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (nombre) whereCondition.nombre = nombre;

    // Busca el inventario usando la condición dinámica
    const inventario = await inventarioRepository.findOne({
      where: whereCondition,
      relations: ["items"], // Incluye los items relacionados si están definidos en la relación
    });

    if (!inventario) return [null, "Inventario no encontrado"];

    return [inventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function updateItemService(query, body) {
  try {
    const { id, cBarras, descripcion } = query;
    const itemRepository = AppDataSource.getRepository(Item); // Cambiado a itemRepository

    // Buscar el artículo según el criterio (id, cBarras o descripcion)
    const itemFound = await itemRepository.findOne({
      where: [{ id }, { cBarras }, { descripcion }],
    });

    if (!itemFound) return [null, "Artículo no encontrado"];

    // Verificar si ya existe un artículo con el mismo código de barras (para evitar duplicados)
    const duplicateItem = await itemRepository.findOne({
      where: [{ cBarras: body.cBarras }],
    });

    if (duplicateItem && duplicateItem.id !== itemFound.id) {
      return [null, "Ya existe un artículo con el mismo código de barras"];
    }

    // Datos a actualizar
    const dataItemUpdate = {
      descripcion: body.descripcion,
      categoria: body.categoria,
      estado: body.estado,
      updatedAt: new Date(),
    };

    // Actualizar el artículo
    await itemRepository.update({ id: itemFound.id }, dataItemUpdate);
    const updatedItem = await itemRepository.findOne({ where: { id: itemFound.id } });

    if (!updatedItem) return [null, "Artículo no encontrado después de actualizar"];

    return [updatedItem, null];
  } catch (error) {
    console.error("Error al modificar un artículo de inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function addItemService(data) {
  try {
    const { nombre, descripcion, categoria, cBarras, inventario } = data;
    const itemRepository = AppDataSource.getRepository(Item);
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);

    // Buscar el inventario específico
    const inventarioactual = await inventarioRepository.findOne({ where: { nombre: inventario } });
    if (!inventarioactual) {
      return [null, "Inventario no encontrado"];
    }

    // Buscar si el item ya existe en el inventario específico
    let item = await itemRepository.findOne({
      where: { nombre, descripcion, categoria, inventario: { nombre: inventario } },
      relations: ["codigosBarras"], // Incluye los códigos de barras para verificar duplicados
    });

    if (item) {
      // Incrementa la cantidad del item existente
      item.cantidad += 1;

      // Verificar si el código de barras ya existe
      const codigoExistente = item.codigosBarras.find(cb => cb.codigo === cBarras);
      if (codigoExistente) {
        // Si el código de barras ya existe, no incrementar cantidad y devolver un mensaje
        return [null, "El código de barras ya está asociado a este artículo"];
      }
      if (!codigoExistente) {
        // Crear y agregar el nuevo código de barras al item
        const nuevoCodigoBarras = codigoBarrasRepository.create({ codigo: cBarras, item : { id: item.id } });
        await codigoBarrasRepository.save(nuevoCodigoBarras); // Guarda el nuevo código de barras en la base de datos
        item.codigosBarras.push(nuevoCodigoBarras); // Agrega a la lista en memoria del item
      }
    } else {
      // Crear un nuevo item si no existe, con estado predeterminado 0 y cantidad 1
      item = itemRepository.create({
        nombre,
        descripcion,
        categoria,
        estado: 0, // Estado predeterminado
        cantidad: 1, // Inicializar cantidad a 1
        inventario, // Asocia el item al inventario especificado
        codigosBarras: [{ codigo: cBarras }], // Inicializar con el código de barras
      });
    }

    // Guardar el item (ya sea nuevo o actualizado)
    await itemRepository.save(item);

    return [item, null];
  } catch (error) {
    console.error("Error al añadir un artículo al inventario:", error);
    return [null, "Error interno del servidor"];
  }
}



export async function deleteItemService(query) {
  try {
    const { cBarras } = query;
    const itemRepository = AppDataSource.getRepository(Item);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);

    // Buscar el código de barras en la base de datos y obtener el item relacionado
    const codigoBarras = await codigoBarrasRepository.findOne({
      where: { codigo: cBarras },
      relations: ["item"], // Incluir la relación con el item
    });

    if (!codigoBarras || !codigoBarras.item) {
      return [null, "Código de barras o artículo no encontrado"];
    }

    const item = codigoBarras.item;

    // Eliminar el código de barras específico
    await codigoBarrasRepository.remove(codigoBarras);

    // Reducir la cantidad del artículo en 1 solo si aún tiene cantidad
    if (item.cantidad > 0) {
      item.cantidad -= 1;
    }

    // Guardar el artículo con la cantidad actualizada
    await itemRepository.save(item);

    return [item, null];
  } catch (error) {
    console.error("Error al eliminar un artículo del inventario:", error);
    return [null, "Error interno del servidor"];
  }
}





export async function updateInventarioService(id, data) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    // Busca el inventario por id
    const inventario = await inventarioRepository.findOne({ where: { id } });

    if (!inventario) {
      return [null, "Inventario no encontrado"];
    }

    // Actualiza los campos del inventario con los datos proporcionados
    inventario.nombre = data.nombre || inventario.nombre;
    inventario.descripcion = data.descripcion || inventario.descripcion;
    inventario.updatedAt = new Date(); // Actualiza la fecha de modificación

    // Guarda el inventario actualizado en la base de datos
    const inventarioActualizado = await inventarioRepository.save(inventario);

    return [inventarioActualizado, null];
  } catch (error) {
    console.error("Error al actualizar el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteInventarioService(id) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    // Busca el inventario por id
    const inventario = await inventarioRepository.findOne({ where: { id } });

    if (!inventario) {
      return [null, "Inventario no encontrado"];
    }

    // Elimina el inventario
    await inventarioRepository.remove(inventario);

    return [inventario, null];
  } catch (error) {
    console.error("Error al eliminar el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}