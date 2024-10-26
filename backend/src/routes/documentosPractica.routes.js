"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { subirDocumentoPractica } from "../controllers/documentosPractica.controller.js";

const router = Router();

router
    .post("/subir", authenticateJwt, subirDocumentoPractica)


export default router;
