"use strict";
import {
    cerrarPrestamoService,
    createPrestamoService,
    getPrestamoService,
    getPrestamosPorEstadoService
    
} from "../services/prestamos.service.js";
import { getUserService } from "../services/user.service.js"; 

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
    const { rut, codigoBarras, diasPrestamo } = req.body;
    const user = req.user;
   
    const [nuevoPrestamo, error] = await createPrestamoService({ rut, codigoBarras, diasPrestamo,user });
    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error("Error en el controlador al crear el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

/*
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
*/

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

export async function getPrestamosPorEstadoController(req, res) {
  try {
    const { estado } = req.body;

    if (estado === undefined) {
      return res.status(400).json({ message: "El parámetro 'estado' es requerido" });
    }

    const [prestamosData, error] = await getPrestamosPorEstadoService(Number(estado));

    if (error) {
      return res.status(404).json({ message: error });
    }

    return res.status(200).json(prestamosData);
  } catch (error) {
    console.error("Error en el controlador al obtener los préstamos por estado:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
