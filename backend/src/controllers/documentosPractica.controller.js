"use strict";

import { subirDocumentoService, obtenerDocumentosService, obtenerDocumentoPorIdService, actualizarDocumentoService, eliminarDocumentoService } from "../services/documentosPractica.service.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function subirDocumentoPractica(req, res) {
    try {
        const user = req.user;

        if (!req.file) {
            return handleErrorClient(res, 400, "No se ha subido ningún archivo");
        }

        const { fechaLimite } = req.body;
        const archivoPath = req.file.path;

        const [nuevoDocumento, error] = await subirDocumentoService(user, archivoPath, fechaLimite);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Documento subido correctamente.", nuevoDocumento);
    } catch (error) {
        handleErrorServer(res, 500, "Error subiendo el documento.");
    }
}

export async function obtenerDocumentos(req, res) {
    try {
        const [documentos, error] = await obtenerDocumentosService();

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documentos obtenidos correctamente.", documentos);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo los documentos.");
    }
}

export async function obtenerDocumentoPorId(req, res) {
    try {
        const { id } = req.params;
        const [documento, error] = await obtenerDocumentoPorIdService(id);

        if (error) return handleErrorClient(res, 400, error);

        if (!documento) return handleErrorClient(res, 404, "Documento no encontrado.");

        handleSuccess(res, 200, "Documento obtenido correctamente.", documento);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo el documento.");
    }
}

export async function actualizarDocumento(req, res) {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const [documentoActualizado, error] = await actualizarDocumentoService(id, datosActualizados);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documento actualizado correctamente.", documentoActualizado);
    } catch (error) {
        handleErrorServer(res, 500, "Error actualizando el documento.");
    }
}

export async function eliminarDocumento(req, res) {
    try {
        const { id } = req.params;

        const [resultado, error] = await eliminarDocumentoService(id);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documento eliminado correctamente.", resultado);
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando el documento.");
    }
}