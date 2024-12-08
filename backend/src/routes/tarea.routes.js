"use strict";
import { Router } from "express";
import { isProfesor, isProfesorOrEstudiante } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    crearTarea,
    deshabilitarTarea,
    getTarea,
    habilitarTarea,
    updateTarea,
    deleteTarea
} from "../controllers/tarea.controller.js";

const router = Router();

router
    .use(authenticateJwt);

router
    .post("/crear", isProfesor, crearTarea)
    .get("/mostrar/:id", isProfesorOrEstudiante, getTarea)
    .patch("/actualizar/:id", isProfesor, updateTarea)
    .delete("/deshabilitar/:id", isProfesor, deshabilitarTarea)
    .patch("/habilitar/:id", isProfesor, habilitarTarea)
    .delete("/eliminar/:id", isProfesor, deleteTarea);

export default router;