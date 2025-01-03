"use strict";
import {
  actualizarComentarioPrestamo,
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
    const { rut, codigosBarras, diasPrestamo } = req.body;

    if (!rut || !Array.isArray(codigosBarras) || codigosBarras.length === 0 || !diasPrestamo) {
      return res.status(400).json({
        message: "Faltan datos necesarios para crear el préstamo.",
        datosRecibidos: { rut, codigosBarras, diasPrestamo },
      });
    }

    const [nuevoPrestamo, error] = await createPrestamoService({
      rut,
      codigosBarras,
      diasPrestamo,
      encargadoRut: req.user.rut, 
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

   
    if (nuevoPrestamo.usuario) {
      delete nuevoPrestamo.usuario.password; 
      delete nuevoPrestamo.usuario.email;   
      delete nuevoPrestamo.usuario.permisos; 
      delete nuevoPrestamo.usuario.nivel;   
      delete nuevoPrestamo.usuario.especialidad;
    }

    return res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
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
    
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "ID no proporcionado en la URL" });
    }

    console.log("ID recibido en el controlador:", id); 
    const [prestamo, errorClose] = await cerrarPrestamoService(id);

    if (errorClose) {
      return res.status(400).json({ message: errorClose });
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
    return res.status(400).json({ message: error.message });
  }
}


export async function comentarioPrestamoController(req, res) {
  try {
    const { id, comentario } = req.body;

    if (!id || comentario === undefined) {
      return res.status(400).json({ error: "Los campos 'id' y 'comentario' son obligatorios." });
    }

    const [resultado, error] = await actualizarComentarioPrestamo(id, comentario);

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({
      message: "Comentario actualizado exitosamente",
      prestamo: resultado,
    });
  } catch (error) {
    console.error("Error en actualizarComentarioPrestamoController:", error.message);
    return res.status(400).json({ message: error.message });
  }
}
