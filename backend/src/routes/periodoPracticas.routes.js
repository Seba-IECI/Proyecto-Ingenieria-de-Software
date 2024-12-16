"use strict";
import { Router } from "express";
import { habilitarPeriodo, deshabilitarPeriodo, listarPeriodosController, eliminarPeriodoController } from "../controllers/periodoPracticas.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/habilitar",authenticateJwt, habilitarPeriodo);
router.patch("/deshabilitar/:id",authenticateJwt, deshabilitarPeriodo);
router.get("/listar", authenticateJwt, listarPeriodosController);
router.delete("/eliminar/:id", authenticateJwt, eliminarPeriodoController);

export default router;

