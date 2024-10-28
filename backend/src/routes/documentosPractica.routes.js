"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { subirDocumentoPractica } from "../controllers/documentosPractica.controller.js";
import { handleFileSizeLimit, upload } from "../middlewares/subirArchivos.middleware.js";

const router = Router();

router
    .post("/subir", authenticateJwt, upload.single("archivo"), handleFileSizeLimit, subirDocumentoPractica)

export default router;