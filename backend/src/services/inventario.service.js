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

    
    const duplicateInventario = await inventarioRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (duplicateInventario) {
      return [null, "Ya existe un inventario con el mismo nombre"];
    }

    
    const nuevoInventario = inventarioRepository.create({
      nombre: body.nombre,
      descripcion: body.descripcion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

   
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

   
    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (nombre) whereCondition.nombre = nombre;

   
    const inventario = await inventarioRepository.findOne({
      where: whereCondition,
      relations: ["items"], 
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
    const itemRepository = AppDataSource.getRepository(Item); 

    
    const itemFound = await itemRepository.findOne({
      where: [{ id }, { cBarras }, { descripcion }],
    });

    if (!itemFound) return [null, "Artículo no encontrado"];

    
    const duplicateItem = await itemRepository.findOne({
      where: [{ cBarras: body.cBarras }],
    });

    if (duplicateItem && duplicateItem.id !== itemFound.id) {
      return [null, "Ya existe un artículo con el mismo código de barras"];
    }

   
    const dataItemUpdate = {
      descripcion: body.descripcion,
      categoria: body.categoria,
      estado: body.estado,
      updatedAt: new Date(),
    };

    
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

    
    const inventarioactual = await inventarioRepository.findOne({ where: { nombre: inventario } });
    if (!inventarioactual) {
      return [null, "Inventario no encontrado"];
    }

   
    let item = await itemRepository.findOne({
      where: { nombre, descripcion, categoria, inventario: { nombre: inventario } },
      relations: ["codigosBarras"], 
    });

    if (item) {
      
      item.cantidad += 1;

      
      const codigoExistente = item.codigosBarras.find(cb => cb.codigo === cBarras);
      if (codigoExistente) {
        
        return [null, "El código de barras ya está asociado a este artículo"];
      }
      if (!codigoExistente) {
        
        const nuevoCodigoBarras = codigoBarrasRepository.create({ codigo: cBarras, item : { id: item.id } });
        await codigoBarrasRepository.save(nuevoCodigoBarras); 
        item.codigosBarras.push(nuevoCodigoBarras); 
      }
    } else {
      
      item = itemRepository.create({
        nombre,
        descripcion,
        categoria,
        estado: 0, 
        cantidad: 1, 
        inventario, 
        codigosBarras: [{ codigo: cBarras }], 
      });
    }

    
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

    
    const codigoBarras = await codigoBarrasRepository.findOne({
      where: { codigo: cBarras },
      relations: ["item"], 
    });

    if (!codigoBarras || !codigoBarras.item) {
      return [null, "Código de barras o artículo no encontrado"];
    }

    const item = codigoBarras.item;

    
    await codigoBarrasRepository.remove(codigoBarras);

    
    if (item.cantidad > 0) {
      item.cantidad -= 1;
    }

    
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

   
    const inventario = await inventarioRepository.findOne({ where: { id } });

    if (!inventario) {
      return [null, "Inventario no encontrado"];
    }

    
    inventario.nombre = data.nombre || inventario.nombre;
    inventario.descripcion = data.descripcion || inventario.descripcion;
    inventario.updatedAt = new Date();

    
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

    
    const inventario = await inventarioRepository.findOne({ where: { id } });

    if (!inventario) {
      return [null, "Inventario no encontrado"];
    }

    
    await inventarioRepository.remove(inventario);

    return [inventario, null];
  } catch (error) {
    console.error("Error al eliminar el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}
