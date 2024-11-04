import { Router }from "express";
import {
    cerrarPrestamoController,
    createPrestamoController,
    getPrestamoController,
    getPrestamosPorEstadoController
    
  } from "../controllers/prestamos.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
    .use(authenticateJwt);

// Obtener un préstamo específico
router.get("/", getPrestamoController);

// Crear un nuevo préstamo
router.post("/", createPrestamoController);

//Traer prestamos por estado
router.get("/estado", getPrestamosPorEstadoController);


// Cerrar un préstamo
router.patch("/cerrar", cerrarPrestamoController);

export default router;
