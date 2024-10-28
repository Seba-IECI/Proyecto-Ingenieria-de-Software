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
    const { userId } = req.body; 

    
    const [user, userError] = await getUserByIdService(userId);

    if (userError) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.amonestacionesActivas > 0 || user.amonestacionesTotales >= 3) {
      return res.status(403).json({ message: "No se puede crear el préstamo, por amonestaciones" });
    }

   
    const [nuevoPrestamo, error] = await createPrestamoService(req.body);

    if (error) {
      return res.status(500).json({ message: error });
    }

   
    return res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error("Error en el controlador al crear el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


export async function updatePrestamoController(req, res) {
  try {
   
    const { id } = req.params;
    const { nuevoEstado } = req.body;

   
    const [prestamo, error] = await updatePrestamoService(id, nuevoEstado);

    if (error) {
      return res.status(404).json({ message: error });
    }

    
    return res.status(200).json(prestamo);
  } catch (error) {
    console.error("Error en el controlador al actualizar el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


export async function cerrarPrestamoController(req, res) {
  try {
    
    const { id, cBarras, rut } = req.query;
    
    
    const [prestamoData, errorGet] = await getPrestamoService({ id, cBarras, rut });

    if (errorGet) {
      return res.status(404).json({ message: errorGet });
    }

    
    const prestamoId = prestamoData.id;

   
    const [prestamo, errorClose] = await cerrarPrestamoService(prestamoId);

    if (errorClose) {
      return res.status(404).json({ message: errorClose });
    }

    
    return res.status(200).json(prestamo);
  } catch (error) {
    console.error("Error en el controlador al cerrar el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
