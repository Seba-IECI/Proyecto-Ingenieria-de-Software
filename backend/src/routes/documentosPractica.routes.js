"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    eliminarDocumentoPractica,
    subirDocumentoPractica
} from "../controllers/documentosPractica.controller.js";
import { uploadMiddleware } from "../middlewares/subirArchivos.middleware.js";

const router = Router();

router
    .post("/subir", authenticateJwt, uploadMiddleware, subirDocumentoPractica)
    .delete("/eliminar/:id", authenticateJwt, eliminarDocumentoPractica)

export default router;