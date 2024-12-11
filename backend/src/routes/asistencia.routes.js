"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    actualizarAsistencia,
    calcularPorcentajeAsistencia,
    eliminarAsistencia,
    listarAsistencias,
    obtenerAsistenciaPorId,
    registrarAsistencia,
    validarAlumnoPorProfesor
} from "../controllers/asistencia.controller.js";

const router = Router();

router
    .post("/registrar", authenticateJwt, registrarAsistencia)
    .get("/listar", authenticateJwt, listarAsistencias)
    .get("/obtenerAsistenciaPorId/:id", authenticateJwt, obtenerAsistenciaPorId)
    .get("/porcentaje", authenticateJwt, calcularPorcentajeAsistencia)
    .put("/actualizar/:id", authenticateJwt, actualizarAsistencia)
    .delete("/eliminar/:id", authenticateJwt, eliminarAsistencia)
    .get("/validarAlumnoPorProfesor/:id", authenticateJwt, validarAlumnoPorProfesor);

export default router;
