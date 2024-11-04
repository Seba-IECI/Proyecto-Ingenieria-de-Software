"use strict";
import Prestamos from "../entity/prestamos.entity.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js"; // Asegúrate de que la ruta sea correcta
import CodigoBarras from "../entity/CBarras.entity.js";
import Item from "../entity/item.entity.js";


export async function createPrestamoService(data) {
  try {
    const { rut, codigoBarras, diasPrestamo } = data;

    console.log("Datos recibidos:", data);
    if (!rut || !codigoBarras || !diasPrestamo) {
      return [null, "Faltan datos necesarios para crear el préstamo"];
    }
    

    const usuarioRepository = AppDataSource.getRepository(User);
    const codigoBarrasRepository = AppDataSource.getRepository(CodigoBarras);
    const itemRepository = AppDataSource.getRepository(Item);
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    // Buscar al usuario por rut
    const usuario = await usuarioRepository.findOne({ where: { rut } });
    if (!usuario) {
      return [null, "Usuario no encontrado"];
    }
    

    // Buscar el código de barras y obtener el item relacionado
    const codigoBarrasEntity = await codigoBarrasRepository.findOne({
      where: { codigo: codigoBarras },
      relations: ["item"],
    });
    if (!codigoBarrasEntity) {
      return [null, "Código de barras no encontrado"];
    }

    const item = codigoBarrasEntity.item;

    if (!codigoBarrasEntity.disponible) {
      return [null, "Este código de barras ya está prestado"];
    }

    // Verificar disponibilidad del item
    if (item.cantidad <= 0) {
      return [null, "No hay unidades disponibles para prestar este item"];
    }

    // Calcular la fecha de vencimiento sumando los días al préstamo
    const fechaPrestamo = new Date();
    const fechaVencimiento = new Date(fechaPrestamo);
    fechaVencimiento.setDate(fechaPrestamo.getDate() + diasPrestamo);

    // Crear el nuevo préstamo
    const nuevoPrestamo = prestamoRepository.create({
      usuario: usuario,
      item: item,
      estado: 1, // Estado inicial del préstamo
      fechaPrestamo: fechaPrestamo,
      fechaVencimiento: fechaVencimiento,
    });

    // Disminuir la cantidad del item
    item.cantidad -= 1;

    // Guardar los cambios en el item y el préstamo
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


export async function getPrestamoService(query) {
  try {
    const { id, cBarras, rut } = query;

    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (rut) whereCondition["usuario.rut"] = rut;

    const prestamo = await prestamoRepository.findOne({
      where: whereCondition,
      relations: ["usuario", "item", "item.codigosBarras"], // Añadimos la relación 'item.codigosBarras'
    });

    if (!prestamo) return [null, "Préstamo no encontrado"];

    // Verificamos que el código de barras coincida
    const tieneCodigoBarras = cBarras
      ? prestamo.item?.codigosBarras.some(cb => cb.codigo === cBarras)
      : true;

    if (!tieneCodigoBarras) return [null, "Préstamo no encontrado para el código de barras especificado"];

    const prestamoData = {
      id: prestamo.id,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      nombreUsuario: prestamo.usuario?.nombreCompleto,
      rutUsuario: prestamo.usuario?.rut,
      fechaVencimiento: prestamo.fechaVencimiento,
      itemDescripcion: prestamo.item?.descripcion,
      codigoBarras: cBarras,
    };

    return [prestamoData, null];
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}


//busco los prestamos activos o pasados, dependiendo del valor que paso en el estado
export async function getPrestamosPorEstadoService(estado) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const whereCondition = { estado }; // Filtra los préstamos según el estado proporcionado

    const prestamos = await prestamoRepository.find({
      where: whereCondition,
      relations: ["usuario", "item", "item.codigosBarras"], // Incluye las relaciones necesarias
    });

    if (prestamos.length === 0) return [null, `No se encontraron préstamos con estado ${estado}`];

    const prestamosData = prestamos.map(prestamo => ({
      id: prestamo.id,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      nombreUsuario: prestamo.usuario?.nombreCompleto,
      rutUsuario: prestamo.usuario?.rut,
      itemDescripcion: prestamo.item?.descripcion,
      codigoBarras: prestamo.item?.codigosBarras.map(cb => cb.codigo),
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

    // Buscar el préstamo por ID
    const prestamo = await prestamoRepository.findOne({
      where: { id },
      relations: ["item"], // Incluye la relación con el item
    });
    
    if (!prestamo) return [null, "Préstamo no encontrado"];

    // Verificar si el préstamo ya está cerrado
    if (prestamo.estado === 0) return [null, "El préstamo ya está cerrado"];

    // Actualizar el estado del préstamo a cerrado y establecer fecha de devolución
    prestamo.estado = 0;
    prestamo.fechaDevolucion = new Date();

    // Cambiar el estado del item a disponible (0)
    const item = prestamo.item;
    item.estado = 0;

    // Guardar los cambios en el préstamo y el item
    await prestamoRepository.save(prestamo);
    await itemRepository.save(item);

    return [prestamo, null];
  } catch (error) {
    console.error("Error al cerrar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function prestamoVencidoService(req, res) {
  try {
    const { id } = req.query;

    
    const [prestamoData, errorGet] = await getPrestamoService({ id });

    if (errorGet) {
      return res.status(404).json({ message: errorGet });
    }

    
    const fechaActual = new Date();
    const fechaDevolucion = new Date(prestamoData.fechaDevolucion);

    if (fechaDevolucion < fechaActual) {
      
      const [amonestacion, errorAmonestacion] = await addAmonestacionService(prestamoData.usuario.id);

      if (errorAmonestacion) {
        return res.status(500).json({ message: errorAmonestacion });
      }

      return res.status(200).json({
        message: "El préstamo está vencido. Amonestación añadida al usuario.",
        amonestacionesActivas: amonestacion.amonestacionesActivas,
        amonestacionesTotales: amonestacion.amonestacionesTotales,
      });
    }

    return res.status(200).json({ message: "El préstamo no está vencido." });
  } catch (error) {
    console.error("Error al verificar el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
