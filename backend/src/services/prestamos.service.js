"use strict";
import Prestamos from "../entity/prestamos.entity.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js"; 
import CodigoBarras from "../entity/CBarras.entity.js";
import Item from "../entity/item.entity.js";
import Inventario from "../entity/inventario.entity.js";
import { addAmonestacionService,getAmonestacionesService } from "./amonestaciones.service.js";

export async function createPrestamoService(data) {
  try {
    const { rut, codigoBarras, diasPrestamo, user } = data;

    if (!rut || !codigoBarras || !diasPrestamo) {
      return [null, "Faltan datos necesarios para crear el préstamo"];
    }

    const usuarioRepository = AppDataSource.getRepository(User);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);
    const itemRepository = AppDataSource.getRepository(Item);
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const usuario = await usuarioRepository.findOne({ where: { rut } });
    if (!usuario) {
      return [null, "Usuario no encontrado"];
    }

    const [amonestaciones, error] = await getAmonestacionesService(usuario.id);
    if (error) {
      return [null, error];
    }

    if (amonestaciones.some(amonestacion => amonestacion.activa)) {
      return [null, "El usuario tiene amonestaciones activas y no puede solicitar un préstamo"];
    }

    const prestamoActivoUsuario = await prestamoRepository.findOne({
      where: { usuario: { id: usuario.id }, estado: 1 },
    });

    if (prestamoActivoUsuario) {
      return [null, "El usuario ya tiene un préstamo activo y no puede solicitar otro"];
    }

    const codigoBarrasEntity = await codigoBarrasRepository.findOne({
      where: { codigo: codigoBarras },
      relations: ["item", "item.inventario"],
    });

    if (!codigoBarrasEntity || !codigoBarrasEntity.item || !codigoBarrasEntity.item.inventario) {
      return [null, "Código de barras o inventario no encontrado"];
    }

    const item = codigoBarrasEntity.item;
    const inventario = item.inventario;

    if (!inventario || !inventario.nombre) {
      return [null, "Inventario no encontrado o no tiene un nombre válido"];
    }

    
    
    if (!user || !user.permisos.includes(inventario.nombre) ) {
      return [null, "No tienes permiso para realizar esta acción en este inventario"];
    }
    

    if (!codigoBarrasEntity.disponible) {
      return [null, "Este código de barras ya está prestado"];
    }

    if (item.cantidad <= 0) {
      return [null, "No hay unidades disponibles para prestar este item"];
    }

    const prestamoActivo = await prestamoRepository.findOne({
      where: { codigoBarras: codigoBarrasEntity, estado: 1 },
    });

    if (prestamoActivo) {
      return [null, "Este código de barras ya tiene un préstamo activo"];
    }

    const fechaPrestamo = new Date();
    const fechaVencimiento = new Date(fechaPrestamo);
    fechaVencimiento.setDate(fechaPrestamo.getDate() + diasPrestamo);

    const nuevoPrestamo = prestamoRepository.create({
      usuario,
      item,
      codigoBarras: codigoBarrasEntity,
      estado: 1,
      fechaPrestamo,
      fechaVencimiento,
    });

    codigoBarrasEntity.disponible = false;
    await codigoBarrasRepository.save(codigoBarrasEntity);

    item.cantidad -= 1;
    await itemRepository.save(item);

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
      item: {
        descripcion: item.descripcion,
        codigoBarras: codigoBarras,
      },
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
    const { id, cBarras, rut } = query;

    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const qb = prestamoRepository.createQueryBuilder("prestamo")
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

    const codigoBarrasAsociado = prestamo.item.codigosBarras.find(cb => cb.codigo === cBarras);

    const prestamoData = {
      id: prestamo.id,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      nombreUsuario: prestamo.usuario?.nombreCompleto,
      rutUsuario: prestamo.usuario?.rut,
      fechaVencimiento: prestamo.fechaVencimiento,
      itemDescripcion: prestamo.item?.descripcion,
      codigoBarras: codigoBarrasAsociado ? codigoBarrasAsociado.codigo : null,
    };

    return [prestamoData, null];
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function getPrestamosPorEstadoService(estado) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const whereCondition = { estado };

    const prestamos = await prestamoRepository.find({
      where: whereCondition,
      relations: ["usuario", "item", "codigoBarras"],
    });

    console.log("Préstamos encontrados:", prestamos);

    if (prestamos.length === 0) {
      return [null, `No se encontraron préstamos con estado ${estado}`];
    }

    const prestamosData = prestamos.map(prestamo => ({
      id: prestamo.id,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      nombreUsuario: prestamo.usuario?.nombreCompleto || "Usuario no encontrado",
      rutUsuario: prestamo.usuario?.rut || "RUT no disponible",
      itemDescripcion: prestamo.item?.descripcion || "Descripción no disponible",
      codigoBarras: prestamo.codigoBarras?.codigo || "Código de barras no disponible", 
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
    const itemRepository = AppDataSource.getRepository(Item);


    const prestamo = await prestamoRepository.findOne({
      where: { id },
      relations: ["item"], 
    });
    
    if (!prestamo) return [null, "Préstamo no encontrado"];

    
    if (prestamo.estado === 0) return [null, "El préstamo ya está cerrado"];

    
    prestamo.estado = 0;
    prestamo.fechaDevolucion = new Date();

    
    const item = prestamo.item;
    item.estado = 0;

    
    await prestamoRepository.save(prestamo);
    await itemRepository.save(item);

    return [prestamo, null];
  } catch (error) {
    console.error("Error al cerrar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function prestamoVencidoService(id) {
  try {
    const [prestamo, errorGet] = await getPrestamoInterno({ id });

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
