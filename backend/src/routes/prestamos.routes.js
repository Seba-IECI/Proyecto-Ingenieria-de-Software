import { Router }from "express";
import {
    cerrarPrestamoController,
    comentarioPrestamoController,
    createPrestamoController,
    getPrestamoController,
    getPrestamosPorEstadoController
    
  } from "../controllers/prestamos.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin, isProfesor } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    


router.get("/", getPrestamoController);

router.post("/",isProfesor, createPrestamoController);


router.get("/estado", getPrestamosPorEstadoController);
router.patch("/comentario",comentarioPrestamoController);


router.patch("/cerrar",isProfesor, cerrarPrestamoController);



export default router;
