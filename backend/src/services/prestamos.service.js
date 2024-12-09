"use strict";
import Prestamos from "../entity/prestamos.entity.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js"; 
import CodigoBarras from "../entity/cBarras.entity.js";
import Item from "../entity/item.entity.js";
import Inventario from "../entity/inventario.entity.js";
import { addAmonestacionService,getAmonestacionesService } from "./amonestaciones.service.js";

export async function createPrestamoService(data) {
  try {
    const { rut, codigosBarras, diasPrestamo, user } = data;

    if (!rut || !codigosBarras || codigosBarras.length === 0 || !diasPrestamo) {
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

    if (amonestaciones.some((amonestacion) => amonestacion.activa)) {
      return [null, "El usuario tiene amonestaciones activas y no puede solicitar un préstamo"];
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
        relations: ["item", "item.inventario"],
      });

      if (!codigoBarrasEntity || !codigoBarrasEntity.item || !codigoBarrasEntity.item.inventario) {
        return [null, `Código de barras ${codigo} no encontrado o sin inventario`];
      }

      const item = codigoBarrasEntity.item;
      const inventario = item.inventario;

      if (!inventario || !inventario.nombre) {
        return [null, `Inventario no encontrado para el código ${codigo}`];
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
    const fechaVencimiento = new Date(fechaPrestamo);
    fechaVencimiento.setDate(fechaPrestamo.getDate() + diasPrestamo);

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
