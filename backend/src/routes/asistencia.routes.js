"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    listarAsistencias,
    obtenerAsistenciaPorId,
    registrarAsistencia,
} from "../controllers/asistencia.controller.js";

const router = Router();

router
    .post("/registrar", authenticateJwt, registrarAsistencia)
    .get("/listar", authenticateJwt, listarAsistencias)
    .get("/:id", authenticateJwt, obtenerAsistenciaPorId)

export default router;
