"use strict";
import Inventario from "../entity/inventario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Item from "../entity/item.entity.js";
import CodigoBarras from "../entity/cBarras.entity.js";
import User from "../entity/user.entity.js";


// Validaciones internas
function validarId(id) {
  if (!id) throw new Error("El ID es obligatorio.");
  if (!/^\d+$/.test(id)) throw new Error("El ID debe ser un número válido sin espacios ni signos.");
}

function validarDescripcion(descripcion) {
  if (!descripcion) throw new Error("la descripcion es obligatorio.");
  if (typeof descripcion !== "string" || descripcion.length > 100 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/
.test(descripcion)) {
      throw new Error("La descripcion debe tener máximo 100 caracteres y solo puede contener letras, números y espacios.");
  }
}

function validarNombre(nombre) {
  if (!nombre) throw new Error("El nombre es obligatorio.");
  if (
    typeof nombre !== "string" ||    nombre.length > 50 ||    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/
.test(nombre)
  ) {
    throw new Error(
      "El nombre debe tener máximo 50 caracteres y solo puede contener letras, espacios y guiones."
    );
  }
}
function validarCategoria(categoria) {
  if (!categoria) throw new Error("La categoria es obligatorio.");
  if (
    typeof categoria !== "string" ||    categoria.length > 50 ||    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/
.test(categoria)
  ) {
    throw new Error(
      "El categoria debe tener máximo 50 caracteres y solo puede contener letras, espacios y guiones."
    );
  }
}
function validarInventario(inventario) {
  if (!inventario) throw new Error("El inventario es obligatorio.");
  if (
    typeof inventario !== "string" ||    inventario.length > 50 ||    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/
.test(inventario)
  ) {
    throw new Error(
      "El inventario debe tener máximo 50 caracteres y solo puede contener letras, espacios y guiones."
    );
  }
}

function validarRut(rut) {
  if (!rut) throw new Error("El RUT es obligatorio.");
  const rutLimpio = rut.replace(/[^0-9kK]/g, "");
  if (!/^[0-9]+[kK0-9]$/.test(rutLimpio)) throw new Error("El RUT tiene un formato inválido.");
  const cuerpo = rutLimpio.slice(0, -1);
  const digitoVerificador = rutLimpio.slice(-1).toUpperCase();
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }
  const dvCalculado = 11 - (suma % 11);
  const dvFinal = dvCalculado === 11 ? "0" : dvCalculado === 10 ? "K" : String(dvCalculado);
  if (digitoVerificador !== dvFinal) throw new Error("El RUT es inválido.");
}

function validarDias(dias) {
  if (dias === undefined || dias === null) throw new Error("Los días son obligatorios.");
  if (!Number.isInteger(dias) || dias < 0 || dias > 3) throw new Error("Los días deben ser un número entero entre 0 y 3.");
}

function validarCodigoBarras(codigo) {
  if (!codigo) {
      throw new Error("El código de barras es obligatorio.");
  }
  if (!/^[a-zA-Z0-9]+$/.test(codigo)) {
      throw new Error("El código de barras solo puede contener letras y números.");
  }
  if (codigo.length !== 9) {
      throw new Error("El código de barras debe tener exactamente 9 caracteres.");
  }
}

export async function getItemService(query) {
  try {
    const { id, cBarras, nombre } = query;
    const itemRepository = AppDataSource.getRepository(Item);

    if (!id && !nombre && !cBarras) {
      throw new Error("Debe proporcionar al menos uno de los siguientes identificadores: id, nombre o cBarras.");
    }
    if (id) validarId(id);
    if (nombre) validarNombre(nombre);
    if (cBarras) validarCodigoBarras(cBarras);

    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (cBarras) whereCondition.cBarras = cBarras;
    if (nombre) whereCondition.nombre = nombre;

    const itemFound = await itemRepository.findOne({
      where: whereCondition,
      relations: ["codigosBarras"], 
    });

    if (!itemFound) return [null, "Artículo no encontrado"];

    return [itemFound, null];
  } catch (error) {
    console.error("Error al obtener el artículo de inventario:", error);
    return [null, error.message || "Error interno del servidor"];
  }
}



export async function createInventarioService(body) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const userRepository = AppDataSource.getRepository( User );

    const { nombre, descripcion, encargadoRut } = body;

    validarNombre(nombre);
    validarRut(encargadoRut);
    validarDescripcion(descripcion);

    const duplicateInventario = await inventarioRepository.findOne({
      where: { nombre },
    });

    if (duplicateInventario) {
      return [null, "Ya existe un inventario con el mismo nombre"];
    }

    const encargado = await userRepository.findOne({
      where: { rut: encargadoRut },
    });

    if (!encargado) {
      return [null, "Usuario encargado no encontrado"];
    }

    if (!encargadoRut || typeof encargadoRut !== "string" || encargadoRut.length > 20) {
      return [null, "RUT del encargado no válido"];
    }

    if (encargado.rol !== "profesor"){
      return [null, "El encargado debe ser un profesor"];
    }
   
    const nuevoInventario = inventarioRepository.create({
      nombre,
      descripcion,
      encargado: encargadoRut,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

   
    await inventarioRepository.save(nuevoInventario);

    if (!encargado.permisos) {
      encargado.permisos = [];
    }

    if (!encargado.permisos.includes(nombre)) {
      encargado.permisos.push(nombre); 
      await userRepository.save(encargado); 
    }

    return [nuevoInventario, null];
  } catch (error) {
    console.error("Error al crear inventario:", error);
    return [null, error.message || "Error interno del servidor"];
    
  }};


export async function getInventarioByIdService(query, user) {
  try {
    const { id, nombre } = query;
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    
    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (nombre) whereCondition.nombre = nombre;

    
    if (user?.rol !== "administrador") {
      whereCondition.encargado = user.rut;
    }

    
    const inventario = await inventarioRepository
      .createQueryBuilder("inventario")
      .leftJoin("inventario.items", "item") 
      .select([
        "inventario.id AS id",
        "inventario.nombre AS nombre",
        "inventario.descripcion AS descripcion",
        "COUNT(item.id) AS itemCount",
        "inventario.encargado AS encargado",
      ])
      .where(whereCondition) 
      .groupBy("inventario.id")
      .addGroupBy("inventario.nombre")
      .addGroupBy("inventario.descripcion")
      .addGroupBy("inventario.encargado")
      .getRawMany(); 

    if (!inventario || inventario.length === 0) return [null, "Inventario no encontrado"];

    return [inventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return [null, error.message || "Error interno del servidor"];
  }
}

export async function updateItemService(query, body, user) {
  try {
    const { id, cBarras, descripcion } = query;
    const itemRepository = AppDataSource.getRepository(Item); 
    validarDescripcion(body.descripcion);
    validarId(id);
    validarCodigoBarras(body.cBarras);

    if (!user || !user.permisos.includes(inventario.nombre)) {
      return [null, `No tienes permiso para modificar este ítem en el inventario: ${inventario.nombre}`];
    }

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
    return [null, error.message || "Error interno del servidor"];
  }
}

export async function addItemService(data, user) {
  try {
    const { nombre, descripcion, categoria, cBarras, inventario } = data;
    console.log("Datos recibidos para añadir un artículo:", data);

    

    validarCodigoBarras(cBarras);
    validarDescripcion(descripcion);
    validarNombre(nombre);
    validarCategoria(categoria);
    validarInventario(inventario);

    const itemRepository = AppDataSource.getRepository(Item);
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);

    console.log("Datos recibidos para añadir un artículo:", data);

    const inventarioactual = await inventarioRepository.findOne({ where: { nombre: inventario } });
    if (!inventarioactual) {
      return [null, "Inventario no encontrado"];
    }

    if (!user || !user.permisos.includes(inventarioactual.nombre)) {
      return [null, `No tienes permiso para realizar esta acción en el inventario: ${inventario}`];
    }

    const nombreNormalizado = nombre.toLowerCase();

    console

    let item = await itemRepository.findOne({
      where: { nombre: nombreNormalizado, inventario: { id: inventarioactual.id } },
      relations: ["codigosBarras"],
    });
    
        
    console.log("Ítem cargado:", item);

    if (item) {
      
      const codigoExistente = item.codigosBarras.find((cb) => cb.codigo === cBarras);
      if (codigoExistente) {
        return [null, "El código de barras ya está asociado a este artículo"];
      }

      console.log("Datos del código de barras a crear:", {
        codigo: cBarras,
        item: { id: item.id },
      });
      
      const nuevoCodigoBarras = codigoBarrasRepository.create({
          codigo: cBarras,
          item: item, 
        });
        await codigoBarrasRepository.save(nuevoCodigoBarras);
      
      console.log("Datos del nuevo código de barras:", {
        codigo: cBarras,
        itemId: item.id, 
      });
     
      item.cantidad += 1;
      await itemRepository.save(item);

      return [item, `Artículo actualizado correctamente. Se añadió el código de barras: ${cBarras}`];
    } 
    if (!item) {
      
      item = itemRepository.create({
        nombre: nombreNormalizado,
        descripcion,
        categoria,
        estado: 0,
        cantidad: 1,
        inventario: inventarioactual,
        codigosBarras: [{ codigo: cBarras }], 
      });

      await itemRepository.save(item);

      return [item, "Nuevo artículo creado exitosamente"];
    }
  } catch (error) {
    console.error("Error al añadir un artículo al inventario:", error.message || error);
    throw new Error(error.message );
  }
}

export async function deleteItemService(query,user) {
  try {
    const { cBarras } = query;
    validarCodigoBarras(cBarras);
    const itemRepository = AppDataSource.getRepository(Item);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);
 
    const codigoBarras = await codigoBarrasRepository.findOne({
      where: { codigo: cBarras },
      relations: ["item", "item.inventario"],
    });

    if (!codigoBarras || !codigoBarras.item) {
      return [null, "Código de barras o artículo no encontrado"];
    }

    const item = codigoBarras.item;
    const inventario = item.inventario;

    if (!user || !user.permisos.includes(inventario.nombre)) {
      return [null, `No tienes permiso para realizar esta acción en el inventario: ${inventario.nombre}`];
    }

    await codigoBarrasRepository.remove(codigoBarras);

    if (item.cantidad > 0) {
      item.cantidad -= 1;
    }

    
    await itemRepository.save(item);

    return [item, null];
  } catch (error) {
    console.error("Error al eliminar un artículo del inventario:", error);
    throw new Error(error.message);
  }
}


export async function updateInventarioService(id, data) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    const inventario = await inventarioRepository.findOne({ where: { id } });

    if (!inventario) {
      return [null, "Inventario no encontrado"];
    }

    
    if (data.nombre !== undefined) inventario.nombre = data.nombre;
    if (data.descripcion !== undefined) inventario.descripcion = data.descripcion;
    if (data.encargado !== undefined) inventario.encargado = data.encargado; 

    validarDescripcion(data.descripcion);
    validarNombre(data.nombre);
    validarRut(data.encargado);


    inventario.updatedAt = new Date(); 

 
    const inventarioActualizado = await inventarioRepository.save(inventario);

    return [inventarioActualizado, null];
  } catch (error) {
    console.error("Error al actualizar el inventario:", error);
    throw new Error(error.message);
  }
}


export async function deleteInventarioService(id) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    validarId(id);
    const inventario = await inventarioRepository.findOne({ where: { id } });

    if (!inventario) {
      return [null, "Inventario no encontrado"];
    }

    
    await inventarioRepository.remove(inventario);

    return [inventario, null];
  } catch (error) {
    console.error("Error al eliminar el inventario:", error);
    throw new Error(error.message);
  }
}

export async function getInventariosService() {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    
    const inventarios = await inventarioRepository
    .createQueryBuilder("inventario")
    .leftJoin("inventario.items", "item") 
    .select([
      "inventario.id AS id",
      "inventario.nombre AS nombre",
      "inventario.descripcion AS descripcion", 
      "COUNT(item.id) AS itemCount",
      "inventario.encargado AS encargado" 
    ])
    .groupBy("inventario.id") 
    .addGroupBy("inventario.nombre") 
    .addGroupBy("inventario.descripcion") 
    .addGroupBy("inventario.encargado") 
    .getRawMany(); 
    if (!inventarios || inventarios.length === 0) {
      return [null, "No se encontraron inventarios"];
    }

    return [inventarios, null];
  } catch (error) {
    console.error("Error al obtener nombres de inventarios y número de items:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getInventarioWithItemsService(query) {
  try {
    const { id } = query;
    const inventarioRepository = AppDataSource.getRepository("Inventario");
    validarId(id);

    
    if (!id) {
      return [null, "El ID del inventario es obligatorio"];
    }

    
    const inventario = await inventarioRepository.findOne({
      where: { id: parseInt(id, 10) }, 
      relations: ["items", "items.codigosBarras"], 
    });

    
    if (!inventario) {
      return [null, "Inventario no encontrado"];
    }

    
    const transformedInventario = {
      id: inventario.id,
      nombre: inventario.nombre,
      descripcion: inventario.descripcion,
      encargado: inventario.encargado,
      cantidad: inventario.items.length,
      items: inventario.items.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        codigosBarras: item.codigosBarras.map((cb) => cb.codigo), 
      })),
    };

    return [transformedInventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario con ítems y códigos de barra:", error);
    throw new Error(error.message);
  }
}

