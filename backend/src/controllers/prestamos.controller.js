"use strict";
import {
    cerrarPrestamoService,
    createPrestamoService,
    getPrestamoService,
    getPrestamosService,
    updatePrestamoService,
} from "../services/prestamos.service.js";


export async function getPrestamoController(req, res) {
  try {
    // Llama al servicio y le pasa `req.query`
    const [prestamoData, error] = await getPrestamoService(req.query);

    if (error) {
      return res.status(404).json({ message: error });
    }

    return res.status(200).json(prestamoData);
  } catch (error) {
    console.error("Error en el controlador de préstamos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function createPrestamoController(req, res) {
  try {
    const { userId } = req.body; // Supongamos que `userId` viene en el cuerpo de la solicitud

    // 1. Obtiene el usuario y verifica sus amonestaciones activas
    const [user, userError] = await getUserByIdService(userId);

    if (userError) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.amonestacionesActivas > 0 || user.amonestacionesTotales >= 3) {
      return res.status(403).json({ message: "No se puede crear el préstamo, por amonestaciones" });
    }

    // 2. Si el usuario no tiene amonestaciones activas, procede a crear el préstamo
    const [nuevoPrestamo, error] = await createPrestamoService(req.body);

    if (error) {
      return res.status(500).json({ message: error });
    }

    // Responde con el nuevo préstamo creado
    return res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error("Error en el controlador al crear el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


export async function updatePrestamoController(req, res) {
  try {
    // Obtiene el id y el nuevo estado del cuerpo de la solicitud
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    // Llama al servicio para actualizar el préstamo
    const [prestamo, error] = await updatePrestamoService(id, nuevoEstado);

    if (error) {
      return res.status(404).json({ message: error });
    }

    // Responde con el préstamo actualizado
    return res.status(200).json(prestamo);
  } catch (error) {
    console.error("Error en el controlador al actualizar el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


export async function cerrarPrestamoController(req, res) {
  try {
    // Extrae id, cBarras y rut de los parámetros de consulta
    const { id, cBarras, rut } = req.query;
    
    // Llama a getPrestamoService para buscar el préstamo basado en cualquiera de estos parámetros
    const [prestamoData, errorGet] = await getPrestamoService({ id, cBarras, rut });

    if (errorGet) {
      return res.status(404).json({ message: errorGet });
    }

    // Extrae el ID del préstamo encontrado
    const prestamoId = prestamoData.id;

    // Llama a cerrarPrestamoService para cerrar el préstamo
    const [prestamo, errorClose] = await cerrarPrestamoService(prestamoId);

    if (errorClose) {
      return res.status(404).json({ message: errorClose });
    }

    // Responde con el préstamo cerrado
    return res.status(200).json(prestamo);
  } catch (error) {
    console.error("Error en el controlador al cerrar el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
