"use strict";
import Prestamos from "../entity/prestamos.entity.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js"; 
import CodigoBarras from "../entity/cBarras.entity.js";
import Item from "../entity/item.entity.js";
import Inventario from "../entity/inventario.entity.js";
import { addAmonestacionService,getAmonestacionesService } from "./amonestaciones.service.js";



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
  
  const valor = Number(dias);

  if (dias === undefined || dias === null || Number.isNaN(valor)) {
    throw new Error("Los días son obligatorios.");
  }

  if (!Number.isInteger(valor) || valor < 0 || valor > 3) {
    throw new Error("Los días deben ser un número entero entre 0 y 3.");
  }
}


function validarCodigoBarras(codigo) {
  
  if (Array.isArray(codigo)) {
    codigo = codigo[0];
  }

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


export async function createPrestamoService(data) {
  try {
    const { rut, codigosBarras, diasPrestamo, user ,encargadoRut } = data;

    console.log("Datos recibidos para crear el préstamo:", { rut, codigosBarras, diasPrestamo, user,encargadoRut });

    if (!rut || !codigosBarras || codigosBarras.length === 0 || !diasPrestamo) {
      return [null, "Faltan datos necesarios para crear el préstamo"];
    }

    validarRut(rut);
    validarDias(diasPrestamo);
    validarCodigoBarras(codigosBarras);
    validarRut(encargadoRut);

    const usuarioRepository = AppDataSource.getRepository(User);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);
    const itemRepository = AppDataSource.getRepository(Item);
    const prestamoRepository = AppDataSource.getRepository(Prestamos);
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    

    const usuario = await usuarioRepository.findOne({ where: { rut } });
    if (!usuario) {
      return [null, "Usuario no encontrado"];
    }

    const [amonestaciones, error] = await getAmonestacionesService(usuario.id);
    if (error) {
      return [null, error];
    }

    if (usuario.amonestacionesActivas >= 3) {
      return [null, "El usuario tiene mas de 3 amonestaciones y no puede solicitar un préstamo"];
    }

    const prestamoActivoUsuario = await prestamoRepository.findOne({
      where: { usuario: { id: usuario.id }, estado: 1 },
    });

    if (prestamoActivoUsuario) {
      return [null, "El usuario ya tiene un préstamo activo y no puede solicitar otro"];
    }

    
    const itemsAsociados = [];
    const codigosBarrasEntities = [];

    for (const codigo of codigosBarras) {
      const codigoBarrasEntity = await codigoBarrasRepository.findOne({
        where: { codigo },
        relations: ["item"],
      });
    
      if (!codigoBarrasEntity || !codigoBarrasEntity.item) {
        return [null, `Código de barras ${codigo} no encontrado`];
      }

      console.log("codigo de barras entity:", codigoBarrasEntity.item.id);
      
      
    
      const item = await itemRepository.findOne({
        where: { id: codigoBarrasEntity.item.id },
        relations: ["inventario"],
      });
    
      if (!item || !item.inventario) {
        return [null, `No se encontró el inventario asociado al ítem del código ${codigo}`];
      }
    
      const inventarioDelItem = item.inventario;

      console.log("inventario sel item:", item.inventario);
    
      console.log("Datos del inventario:", inventarioDelItem);
      console.log("Encargado del inventario:", inventarioDelItem.encargado);
      console.log("Rut del usuario logueado:", encargadoRut);
    
      if (inventarioDelItem.encargado !== encargadoRut) { 
        return [null, `No puedes prestar el item de codigo ${codigo}, ya que no pertenece a este inventario`];
      }
    
      if (!codigoBarrasEntity.disponible) {
        return [null, `El código de barras ${codigo} ya está prestado`];
      }
    
      if (item.cantidad <= 0) {
        return [null, `No hay unidades disponibles para el ítem asociado al código ${codigo}`];
      }
    
      itemsAsociados.push(item.nombre);
      codigosBarrasEntities.push(codigoBarrasEntity);
    }
    
    
    

    const fechaPrestamo = new Date();
const fechaVencimiento = new Date(fechaPrestamo.getTime()); 
fechaVencimiento.setDate(fechaVencimiento.getDate() + parseInt(diasPrestamo, 10)); 



    const nuevoPrestamo = prestamoRepository.create({
      usuario,
      estado: 1,
      fechaPrestamo,
      fechaVencimiento,
      itemsAsociados: JSON.stringify(itemsAsociados),
      codigosAsociados: JSON.stringify(codigosBarras),
      
    });

    for (const codigoBarrasEntity of codigosBarrasEntities) {
      codigoBarrasEntity.disponible = false;
      codigoBarrasEntity.prestamo = nuevoPrestamo;
      await codigoBarrasRepository.save(codigoBarrasEntity);

      const item = codigoBarrasEntity.item;
      item.cantidad -= 1;
      await itemRepository.save(item);
    }

    await prestamoRepository.save(nuevoPrestamo);

    const prestamoData = {
      id: nuevoPrestamo.id,
      fechaPrestamo: nuevoPrestamo.fechaPrestamo,
      fechaVencimiento: nuevoPrestamo.fechaVencimiento,
      estado: nuevoPrestamo.estado,
      usuario: {
        nombreCompleto: usuario.nombreCompleto,
        rut: usuario.rut,
      },
      items: itemsAsociados,
      codigosAsociados: codigosBarras,
    };

    return [prestamoData, null];
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function getPrestamoInterno(query) {
  try {
    const { id, cBarras, rut } = query;

    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const qb = prestamoRepository
      .createQueryBuilder("prestamo")
      .leftJoinAndSelect("prestamo.usuario", "usuario")
      .leftJoinAndSelect("prestamo.item", "item")
      .leftJoinAndSelect("item.codigosBarras", "codigoBarras");

    if (id) {
      qb.andWhere("prestamo.id = :id", { id });
    }
    if (rut) {
      qb.andWhere("usuario.rut = :rut", { rut });
    }
    if (cBarras) {
      qb.andWhere("codigoBarras.codigo = :cBarras", { cBarras });
    }

    const prestamo = await qb.getOne();

    if (!prestamo) {
      return [null, "Préstamo no encontrado"];
    }

    return [prestamo, null];
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamoService(query) {
  try {
    const { id, rut } = query;

    
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const qb = prestamoRepository
      .createQueryBuilder("prestamo")
      .leftJoinAndSelect("prestamo.usuario", "usuario")
      .leftJoinAndSelect("prestamo.codigosBarras", "codigosBarras")
      .leftJoinAndSelect("codigosBarras.item", "item"); 

    if (id) {
      qb.andWhere("prestamo.id = :id", { id });
    }

    if (rut) {
      qb.andWhere("usuario.rut = :rut", { rut });
    }

    const prestamos = await qb.getMany();

    if (!prestamos || prestamos.length === 0) {
      return [null, "Préstamos no encontrados"];
    }

    const prestamosData = prestamos.map((prestamo) => {
      let codigosAsociados = [];
      try {
        codigosAsociados = prestamo.codigosAsociados
          ? JSON.parse(prestamo.codigosAsociados)
          : [];
      } catch (error) {
        console.error(
          `Error al parsear codigosAsociados para el préstamo ${prestamo.id}:`,
          error
        );
      }
      let itemsAsociados = [];
      try {
        itemsAsociados = prestamo.itemsAsociados
          ? JSON.parse(prestamo.itemsAsociados)
          : [];
      } catch (error) {
        console.error(
          `Error al parsear itemsAsociados para el préstamo ${prestamo.id}:`,
          error
        );
      }

      return {
        id: prestamo.id,
        fechaPrestamo: prestamo.fechaPrestamo,
        fechaDevolucion: prestamo.fechaDevolucion,
        nombreUsuario: prestamo.usuario?.nombreCompleto || "Usuario no disponible",
        rutUsuario: prestamo.usuario?.rut || "RUT no disponible",
        userid : prestamo.user_id,
        estado: prestamo.estado,
        items: itemsAsociados.length > 0 ? itemsAsociados : ["Item no disponible"],
        codigosBarras: codigosAsociados.length > 0 ? codigosAsociados : ["Item no disponible"],
        fechaVencimiento: prestamo.fechaVencimiento,
      };
    });

    return [prestamosData, null];
  } catch (error) {
    console.error("Error al obtener los préstamos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamosPorEstadoService(estado) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    validarId(estado);

    const prestamos = await prestamoRepository.find({
      where: { estado },
      relations: ["usuario", "item", "codigosBarras"],
    });
    
    console.log("Préstamos obtenidos:", prestamos);
    

    if (prestamos.length === 0) {
      return [null, `No se encontraron préstamos con estado ${estado}`];
    }

    const prestamosData = prestamos.map((prestamo) => ({
      id: prestamo.id,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      nombreUsuario: prestamo.usuario?.nombreCompleto || "Usuario no encontrado",
      rutUsuario: prestamo.usuario?.rut || "RUT no disponible",
      itemDescripcion: prestamo.item?.descripcion || "Descripción no disponible",
      codigosBarras: prestamo.codigosBarras.map((cb) => cb.codigo),
    }));

    return [prestamosData, null];
  } catch (error) {
    console.error("Error al obtener los préstamos por estado:", error);
    return [null, "Error interno del servidor"];
  }
}


/*export async function updatePrestamoService(id, nuevoEstado) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const prestamo = await prestamoRepository.findOne({ where: { id } });
    if (!prestamo) return [null, "Préstamo no encontrado"];

    prestamo.estado = nuevoEstado;
    await prestamoRepository.save(prestamo);

    return [prestamo, null];
  } catch (error) {
    console.error("Error al actualizar el estado del préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}*/

export async function cerrarPrestamoService(id) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);
    const itemRepository = AppDataSource.getRepository(Item);

    validarId(id);

    
    const prestamo = await prestamoRepository.findOne({
      where: { id },
      relations: ["codigosBarras", "codigosBarras.item"], 
    });
    console.log("Prestamo encontrado:", prestamo);  
    console.log("codigos de prestamo:", prestamo.codigosAsociados);
    

    if (!prestamo) return [null, "Préstamo no encontrado"];
    if (prestamo.estado === 0) return [null, "El préstamo ya está cerrado"];




    const marcarCodigosComoDisponibles = async (codigosAsociados) => {
      const codigos = JSON.parse(codigosAsociados);
      for (const codigoValor of codigos) {
        const codigo = await codigoBarrasRepository.findOne({ where: { codigo: codigoValor } });

        if (!codigo) {
          console.warn(`Código de barras no encontrado: ${codigoValor}`);
          continue;
        }

        codigo.disponible = true;
        await codigoBarrasRepository.save(codigo);
        console.log(`Código de barras actualizado: ${codigoValor}`);
      }
    };

    await marcarCodigosComoDisponibles(prestamo.codigosAsociados);

    prestamo.estado = 0;
    prestamo.fechaDevolucion = new Date();


    const aumentarCantidadItems = async (codigosAsociados) => {
      const codigosBarras = JSON.parse(codigosAsociados); 
      for (const codigoValor of codigosBarras) {
        
        const codigoBarrasEntity = await codigoBarrasRepository.findOne({
          where: { codigo: codigoValor },
          relations: ["item"], 
        });
    
        if (!codigoBarrasEntity || !codigoBarrasEntity.item) {
          console.warn(`Código de barras o ítem no encontrado: ${codigoValor}`);
          continue;
        }
    
        const item = codigoBarrasEntity.item;
        item.cantidad += 1;
    
        await itemRepository.save(item);
        console.log(`Cantidad de ítems actualizada: ${item.nombre}`);
      }
    };
    await aumentarCantidadItems(prestamo.codigosAsociados);

    await prestamoRepository.save(prestamo);

    return [prestamo, null];
  } catch (error) {
    console.error("Error al cerrar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}




export async function prestamoVencidoService(id) {
  try {
    const [prestamo, errorGet] = await getPrestamoInterno({ id });
    validarId(id);

    if (errorGet) {
      return [null, errorGet];
    }

    if (!prestamo || !prestamo.usuario) {
      return [null, "El préstamo o el usuario asociado no se encuentran disponibles"];
    }


    const fechaActual = new Date();
    const fechaDevolucion = new Date(prestamo.fechaDevolucion);

    if (fechaDevolucion < fechaActual) {
      const [amonestacion, errorAmonestacion] = await addAmonestacionService(prestamo.usuario.id);

      if (errorAmonestacion) {
        return [null, errorAmonestacion];
      }

      return [
        {
          message: "El préstamo está vencido. Amonestación añadida al usuario.",
          amonestacionesActivas: amonestacion.amonestacionesActivas,
          amonestacionesTotales: amonestacion.amonestacionesTotales,
        },
        null,
      ];
    }

    return [{ message: "El préstamo no está vencido." }, null];
  } catch (error) {
    console.error("Error al verificar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function actualizarComentarioPrestamo(id, comentario) {
  try {
    const prestamoRepository = AppDataSource.getRepository("Prestamos");
    validarId(id);
    validarDescripcion(comentario);

    
    const prestamo = await prestamoRepository.findOne({ where: { id, estado: 1 } }); // Estado 1: Activo
    if (!prestamo) {
      console.error(`Préstamo con ID ${id} no encontrado o no está activo.`);
      return [null, "Préstamo no encontrado o no está activo"];
    }

    
    prestamo.comentario = comentario;

    
    await prestamoRepository.save(prestamo);

    return [prestamo, null];
  } catch (error) {
    console.error("Error al actualizar el comentario del préstamo:", error.message || error);
    return [null, "Error interno del servidor"];
  }
}
