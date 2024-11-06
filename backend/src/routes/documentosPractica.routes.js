"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { subirDocumentoPractica, obtenerDocumentos, obtenerDocumentoPorId, actualizarDocumento, eliminarDocumento } from "../controllers/documentosPractica.controller.js";
import { uploadMiddleware } from "../middlewares/subirArchivos.middleware.js";

const router = Router();



router
    .post("/subir", authenticateJwt, uploadMiddleware, subirDocumentoPractica)
    .get("/obtenerTodos", authenticateJwt, uploadMiddleware, obtenerDocumentos)
    .get("/obtener/:id", authenticateJwt, uploadMiddleware, obtenerDocumentoPorId)
    .put("actualizar/:id", authenticateJwt, uploadMiddleware, actualizarDocumento)
    .delete("/eliminar/:id",authenticateJwt, uploadMiddleware, eliminarDocumento)

    export default router;