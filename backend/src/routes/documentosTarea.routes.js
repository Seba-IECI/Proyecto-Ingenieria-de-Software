"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { subirDocumentoTarea, obtenerDocumentos } from "../controllers/documentosTarea.controller.js";
import { uploadMiddleware } from "../middlewares/subirArchivos.middleware.js";
import { isEstudiante, isProfesor } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt);
router
    .post("/subir", isEstudiante,uploadMiddleware,subirDocumentoTarea)
    .get("/listar", isProfesor, obtenerDocumentos);
export default router;