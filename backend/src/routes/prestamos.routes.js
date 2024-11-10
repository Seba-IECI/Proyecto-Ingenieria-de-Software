import { Router }from "express";
import {
    cerrarPrestamoController,
    createPrestamoController,
    getPrestamoController,
    getPrestamosPorEstadoController
    
  } from "../controllers/prestamos.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin, isInventario } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    


router.get("/", getPrestamoController);

router.post("/",isInventario, createPrestamoController);


router.get("/estado",isInventario, getPrestamosPorEstadoController);



router.patch("/cerrar",isInventario, cerrarPrestamoController);

export default router;
