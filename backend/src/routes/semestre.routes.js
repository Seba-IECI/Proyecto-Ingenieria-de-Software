"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    actualizarSemestre,
    crearSemestre,
    eliminarSemestre,
    listarSemestres,
    obtenerSemestrePorId,
} from "../controllers/semestre.controller.js";

const router = Router();

router
router
    .post("/crearSemestre", authenticateJwt, crearSemestre)
    .get("/listarSemestres", authenticateJwt, listarSemestres)
    .get("/obtenerSemestrePorId/:id", authenticateJwt, obtenerSemestrePorId)
    .put("/actualizarSemestre/:id", authenticateJwt, actualizarSemestre)
    .delete("/eliminarSemestre/:id", authenticateJwt, eliminarSemestre);


export default router;
