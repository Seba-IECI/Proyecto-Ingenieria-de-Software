"use strict";

import {
    actualizarSemestreService,
    crearSemestreService,
    eliminarSemestreService,
    listarSemestresService,
    obtenerSemestrePorIdService
} from "../services/semestre.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function crearSemestre(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "administrador") {
            return handleErrorClient(res, 403, "Solo los administradores pueden crear semestres.");
        }

        const { nombre, fechaInicio, fechaFin, estado, descripcion } = req.body;
        const [nuevoSemestre, error] = await crearSemestreService(nombre, fechaInicio, fechaFin, estado, descripcion);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Semestre creado correctamente.", nuevoSemestre);
    } catch (error) {
        handleErrorServer(res, 500, "Error al crear el semestre.");
    }
}

export async function listarSemestres(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "administrador") {
            return handleErrorClient(res, 403, "Solo los administradores pueden crear semestres.");
        }

        const [semestres, error] = await listarSemestresService();
        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Semestres obtenidos correctamente", semestres);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener los semestres.");
    }
}

export async function obtenerSemestrePorId(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "administrador") {
            return handleErrorClient(res, 403, "Solo los administradores pueden acceder a esta información.");
        }

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return handleErrorClient(res, 400, "ID de semestre no válido");
        }

        const semestreId = parseInt(id, 10);

        const [semestre, error] = await obtenerSemestrePorIdService(semestreId);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Semestre obtenido correctamente", semestre);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener el semestre.");
    }
}


export async function actualizarSemestre(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "administrador") {
            return handleErrorClient(res, 403, "Solo los administradores pueden realizar esta acción.");
        }

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return handleErrorClient(res, 400, "ID de semestre no válido");
        }

        const semestreId = parseInt(id, 10);
        const { nombre, fechaInicio, fechaFin, estado, descripcion } = req.body;

        const [semestreActualizado, error] = await actualizarSemestreService(
            semestreId, nombre, fechaInicio, fechaFin, estado, descripcion
        );

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Semestre actualizado correctamente", semestreActualizado);
    } catch (error) {
        handleErrorServer(res, 500, "Error al actualizar el semestre.");
    }
}

export async function eliminarSemestre(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "administrador") {
            return handleErrorClient(res, 403, "Solo los administradores pueden crear semestres.");
        }

        const { id } = req.params;

        const semestreId = parseInt(id, 10);

        if (isNaN(semestreId)) {
            return handleErrorClient(res, 400, "ID de semestre no válido");
        }

        const [resultado, error] = await eliminarSemestreService(semestreId);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        handleSuccess(res, 200, "Semestre eliminado correctamente.");
    } catch (error) {
        handleErrorServer(res, 500, "Error al eliminar el semestre.");
    }
}
