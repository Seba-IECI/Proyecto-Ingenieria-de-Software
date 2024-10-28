"use strict";
import Prestamos from "../entity/prestamos.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createPrestamoService(data) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const nuevoPrestamo = prestamoRepository.create({
      ...data,
      estado: "pendiente",
      fechaSolicitud: new Date(),
    });

    await prestamoRepository.save(nuevoPrestamo);

    return [nuevoPrestamo, null];
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}



export async function getPrestamoService(query) {
  try {
    // Obtén `id`, `cBarras`, y `nombreUsuario` de `req.query`
    const { id, cBarras, rut } = req.query;
    
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    // Construimos la condición de búsqueda dinámicamente según los parámetros disponibles
    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (cBarras) whereCondition["inventario.cBarras"] = cBarras;
    if (rut) whereCondition["usuario.rut"] = rut;

    // Realizamos la consulta con las relaciones necesarias
    const prestamo = await prestamoRepository.findOne({
      where: whereCondition,
      relations: ["usuario", "inventario"], // Cargamos las relaciones
    });

    if (!prestamo) return [null, "Préstamo no encontrado"];

    // Extraemos los datos que queremos devolver
    const prestamoData = {
      id: prestamo.id,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      nombreUsuario: prestamo.usuario?.nombreCompleto,
      rutUsuario: prestamo.usuario?.rut,
      itemInventario: prestamo.inventario?.descripcion,
      codigoBarras: prestamo.inventario?.cBarras,
    };

    return [prestamoData, null];
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

///*en que circunstancia?
export async function getPrestamosService() {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const prestamos = await prestamoRepository.find({
      relations: ["inventario", "usuario"], // relaciones para incluir detalles
    });

    if (!prestamos.length) return [null, "No hay préstamos registrados"];
    return [prestamos, null];
  } catch (error) {
    console.error("Error al obtener los préstamos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updatePrestamoService(id, nuevoEstado) {
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
}

export async function cerrarPrestamoService(id) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);

    const prestamo = await prestamoRepository.findOne({ where: { id } });
    if (!prestamo) return [null, "Préstamo no encontrado"];

    prestamo.estado = "cerrado"; // cambiar estado a "cerrado" al devolver
    prestamo.fechaDevolucion = new Date();
    await prestamoRepository.save(prestamo);

    return [prestamo, null];
  } catch (error) {
    console.error("Error al cerrar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function prestamoVencidoService(req, res) {
  try {
    const { id } = req.query;

    // Busca el préstamo por id
    const [prestamoData, errorGet] = await getPrestamoService({ id });

    if (errorGet) {
      return res.status(404).json({ message: errorGet });
    }

    // Aquí puedes verificar si el préstamo está vencido
    const fechaActual = new Date();
    const fechaDevolucion = new Date(prestamoData.fechaDevolucion);

    if (fechaDevolucion < fechaActual) {
      // Llama a `addAmonestacionService` si el préstamo está vencido
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
