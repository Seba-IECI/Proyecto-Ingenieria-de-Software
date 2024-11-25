"use strict";
import { Router } from "express";
import { habilitarPeriodo, deshabilitarPeriodo } from "../controllers/periodoPracticas.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

    const router = Router();
    
    router.post("/habilitar",authenticateJwt, habilitarPeriodo);
    router.patch("/deshabilitar/:id",authenticateJwt, deshabilitarPeriodo);

    export default router;