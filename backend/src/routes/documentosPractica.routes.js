routes:

"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    eliminarDocumentoPractica,
    modificarDocumentoPractica,
    subirDocumentoPractica,
    verDocumentos
} from "../controllers/documentosPractica.controller.js";
import { uploadMiddleware } from "../middlewares/subirArchivos.middleware.js";

const router = Router();

router
    .post("/subir", authenticateJwt, uploadMiddleware, subirDocumentoPractica)
    .delete("/eliminar/:id", authenticateJwt, eliminarDocumentoPractica)
    .put("/modificar/:id", authenticateJwt, uploadMiddleware, modificarDocumentoPractica)
    .get("/verDocumentos", authenticateJwt, verDocumentos);

export default router;