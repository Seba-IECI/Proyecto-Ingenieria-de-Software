"use strict";

import {
    actualizarAsistenciaService,
    calcularPorcentajeAsistenciaService,
    listarAsistenciasService,
    obtenerAsistenciaPorIdService,
    registrarAsistenciaService
} from "../services/asistencia.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function registrarAsistencia(req, res) {
    try {
        const { rol } = req.user;
        if (rol !== "profesor") {
            return handleErrorClient(res, 403, "Solo los profesores pueden registrar asistencia.");
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
        if (user.rol !== "profesor") {
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

        if (user.rol !== "profesor") {
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

export async function calcularPorcentajeAsistencia(req, res) {
    try {
        const { alumnoId, semestreId } = req.query;

        if (!alumnoId || !semestreId) {
            return handleErrorClient(res, 400, "El alumnoId y semestreId son obligatorios");
        }

        const [porcentaje, error] = await calcularPorcentajeAsistenciaService(alumnoId, semestreId);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Porcentaje de asistencia calculado correctamente", { porcentaje });
    } catch (error) {
        console.error("Error en calcularPorcentajeAsistencia:", error);
        handleErrorServer(res, 500, "Error al calcular el porcentaje de asistencia");
    }
}

export async function actualizarAsistencia(req, res) {
    try {
        const { id } = req.params;
        const { presente } = req.body;

        if (!id || isNaN(id)) {
            return handleErrorClient(res, 400, "ID de asistencia no válido");
        }

        const asistenciaId = parseInt(id, 10);
        const [asistenciaActualizada, error] = await actualizarAsistenciaService(asistenciaId, presente);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Asistencia actualizada correctamente", asistenciaActualizada);
    } catch (error) {
        console.error("Error en actualizarAsistencia:", error);
        handleErrorServer(res, 500, "Error al actualizar la asistencia");
    }
}
