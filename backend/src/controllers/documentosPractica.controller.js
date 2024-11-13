"use strict";

import {
    eliminarDocumentoService,
    modificarDocumentoService,
    obtenerTodosDocumentosService,
    subirDocumentoService,
    verDocumentosService
} from "../services/documentosPractica.service.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function subirDocumentoPractica(req, res) {
    try {
        const user = req.user;
        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }

        if (!req.file) {
            return handleErrorClient(res, 400, "No se ha subido ningún archivo");
        }

        const archivoPath = req.file.path;
        const [nuevoDocumento, error] = await subirDocumentoService(user, archivoPath);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Documento subido correctamente.", nuevoDocumento);
    } catch (error) {
        console.error("Error en subirDocumentoPractica:", error);
        handleErrorServer(res, 500, "Error subiendo el documento.");
    }
}

export async function eliminarDocumentoPractica(req, res) {
    try {
        const documentoId = req.params.id;
        const user = req.user;

        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }
        const [resultado, error] = await eliminarDocumentoService(user, documentoId, req);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Documento eliminado correctamente.");
    } catch (error) {
        console.error("Error en eliminarDocumentoPractica:", error);
        handleErrorServer(res, 500, "Error eliminando el documento.");
    }
}

export async function modificarDocumentoPractica(req, res) {
    try {
        const documentoId = req.params.id;
        const user = req.user;

        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }
        const archivoNuevo = req.file ? req.file.path : null;
        const hostUrl = `${req.protocol}://${req.get("host")}`;

        const [resultado, error] = await modificarDocumentoService(user, documentoId, archivoNuevo, hostUrl);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documento modificado correctamente.", resultado);
    } catch (error) {
        console.error("Error en modificarDocumentoPractica:", error);
        handleErrorServer(res, 500, "Error modificando el documento.");
    }
}

export async function verDocumentos(req, res) {
    try {
        const user = req.user;
        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }

        const [documentos, error] = await verDocumentosService(user);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Documentos obtenidos correctamente", documentos);
    } catch (error) {
        console.error("Error en verDocumentosProfesor:", error);
        handleErrorServer(res, 500, "Error al obtener los documentos del profesor");
    }
}

export async function obtenerTodosDocumentos(req, res) {
    try {
        const user = req.user;

        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }

        const [documentos, error] = await obtenerTodosDocumentosService(user);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documentos obtenidos correctamente.", documentos);
    } catch (error) {
        console.error("Error en obtenerTodosDocumentos:", error);
        handleErrorServer(res, 500, "Error obteniendo los documentos.");
    }
}