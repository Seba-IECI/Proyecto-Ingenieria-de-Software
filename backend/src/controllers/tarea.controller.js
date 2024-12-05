"use strict";
import {
    crearTareaService,
    deshabilitarTareaService,
    getTareaService,
    habilitarTareaService,
    updateTareaService,
    deleteTareaService
} from "../services/tarea.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

import { tareaQueryValidation } from "../validations/tarea.validation.js";

export async function crearTarea(req, res) {
    try {
        const { titulo, descripcion, fecha_entrega } = req.body;

        const { error: queryError } = tareaQueryValidation.validate(req.body);
        if (queryError) return handleErrorClient(res, 400, queryError.message);

        const [tarea, errorTarea] = await crearTareaService({ titulo, descripcion, fecha_entrega });

        if (errorTarea) return handleErrorClient(res, 404, errorTarea);

        handleSuccess(res, 200, "Tarea creada", tarea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function habilitarTarea(req, res) {
    try {
        const { id } = req.params;

        const [tarea, errorTarea] = await habilitarTareaService({ id });

        if (errorTarea) return handleErrorClient(res, 404, errorTarea);

        handleSuccess(res, 200, "Tarea habilitada", tarea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deshabilitarTarea(req, res) {
    try {
        const { id } = req.params;

        const [tarea, errorTarea] = await deshabilitarTareaService({ id });

        if (errorTarea) return handleErrorClient(res, 404, errorTarea);

        handleSuccess(res, 200, "Tarea deshabilitada", tarea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getTarea(req, res) {
    try {
        const { id } = req.params;

        const [tarea, errorTarea] = await getTareaService({ id });

        if (errorTarea) return handleErrorClient(res, 404, errorTarea);

        handleSuccess(res, 200, "Tarea encontrada", tarea);
    }
    catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateTarea(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;

        const { error: queryError } = tareaQueryValidation.validate(body);

        if (queryError) return handleErrorClient(res, 400, queryError.message);

        const [tarea, errorTarea] = await updateTareaService({ id,},body);

        if (errorTarea) return handleErrorClient(res, 404, errorTarea);

        handleSuccess(res, 200, "Tarea actualizada", tarea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteTarea(req, res) {
    try {
        const { id } = req.params;

        const [tarea, errorTarea] = await deleteTareaService({ id });

        if (errorTarea) return handleErrorClient(res, 404, errorTarea);

        handleSuccess(res, 200, "Tarea eliminada", tarea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}