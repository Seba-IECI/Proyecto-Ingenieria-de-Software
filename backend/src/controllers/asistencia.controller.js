"use strict";

import {
    listarAsistenciasService,
    obtenerAsistenciaPorIdService,
    registrarAsistenciaService
} from "../services/asistencia.service.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function registrarAsistencia(req, res) {
    try {
        const { rol } = req.user;
        if (rol !== "administrador") {
            return handleErrorClient(res, 403, "Solo los administradores pueden registrar asistencia.");
        }

        const { alumnoId, semestreId, fecha, presente } = req.body;
        const [nuevaAsistencia, error] = await registrarAsistenciaService(
            req.user, alumnoId, semestreId, fecha, presente);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Asistencia registrada correctamente.", nuevaAsistencia);
    } catch (error) {
        console.error("Error en registrarAsistencia:", error);
        handleErrorServer(res, 500, "Error al registrar asistencia.");
    }
}

export async function listarAsistencias(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "administrador") {
            return handleErrorClient(res, 403, "Acceso denegado");
        }

        const { semestreId, alumnoId, startDate, endDate } = req.query;

        const [asistencias, error] = await listarAsistenciasService(semestreId, alumnoId, startDate, endDate);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Asistencias obtenidas correctamente", asistencias);
    } catch (error) {
        console.error("Error en listarAsistencias:", error);
        handleErrorServer(res, 500, "Error al obtener asistencias");
    }
}

export async function obtenerAsistenciaPorId(req, res) {
    try {
        const user = req.user;

        if (user.rol !== "administrador") {
            return handleErrorClient(res, 403, "Acceso denegado");
        }

        const { id } = req.params;

        if (!id || isNaN(parseInt(id, 10))) {
            return handleErrorClient(res, 400, "ID de asistencia no válido");
        }

        const asistenciaId = parseInt(id, 10);

        const [asistencia, error] = await obtenerAsistenciaPorIdService(asistenciaId);

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Asistencia obtenida correctamente", asistencia);
    } catch (error) {
        console.error("Error en obtenerAsistenciaPorId:", error);
        handleErrorServer(res, 500, "Error al obtener la asistencia");
    }
}






