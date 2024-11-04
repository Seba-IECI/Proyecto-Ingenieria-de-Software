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


router.get("/", getPrestamoController);

router.post("/", createPrestamoController);


router.get("/estado", getPrestamosPorEstadoController);



router.patch("/cerrar", cerrarPrestamoController);

export default router;
