"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    eliminarDocumentoPractica,
    modificarDocumentoPractica,
    obtenerTodosDocumentos,
    subirDocumentoPractica,
    verDocumentos
} from "../controllers/documentosPractica.controller.js";
import { uploadMiddleware } from "../middlewares/subirArchivos.middleware.js";

const router = Router();

router
    .post("/subir", authenticateJwt, uploadMiddleware, subirDocumentoPractica)
    .delete("/eliminar/:id", authenticateJwt, eliminarDocumentoPractica)
    .get("/obtenerTodos", authenticateJwt,  obtenerTodosDocumentos)
    .put("/modificarDocumento/:id", authenticateJwt, uploadMiddleware, modificarDocumentoPractica)
    .get("/verDocumentos", authenticateJwt, verDocumentos);

export default router;