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
        const periodoPracticaId = req.periodoPracticaId;
        const { nombre } = req.body;
        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }
        if (!req.file) {
            return handleErrorClient(res, 400, "No se ha subido ningún archivo");
        }

        if (!nombre) {
            return handleErrorClient(res, 400, "El campo 'nombre' es obligatorio.");
        }
        if (user.rol === "usuario") {
            if (
                !user.especialidad
                || !["Mecánica automotriz", "Electricidad", "Electrónica"].includes(user.especialidad)
            ) {
                return handleErrorClient(res, 400, "El alumno debe tener una especialidad válida asignada.");
            }
        } else if (user.rol === "encargadoPracticas" && !req.body.especialidad) {
            return handleErrorClient(res, 400, "Debe especificar la especialidad del documento.");
        }

        const especialidad = user.rol === "usuario" ? user.especialidad : req.body.especialidad;

        const archivoPath = req.file.path;
        const [nuevoDocumento, error] = await subirDocumentoService(
            user,
            archivoPath,
            periodoPracticaId,
            especialidad,
            nombre
        );

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

        if (user.rol === "usuario") {
            if (!["3ro", "4to"].includes(user.nivel)) {
                return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
            }

            if (!user.especialidad
                || !["Mecánica automotriz", "Electricidad", "Electrónica"].includes(user.especialidad)) {
                return handleErrorClient(res, 403,
                    "El usuario debe tener una especialidad válida para realizar esta acción.");
            }
        }

        const [resultado, error] = await eliminarDocumentoService(user, documentoId, req);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Documento eliminado correctamente.");
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando el documento.");
    }
}

export async function modificarDocumentoPractica(req, res) {
    try {
        const documentoId = req.params.id;
        const user = req.user;
        const periodoPracticaId = req.periodoPracticaId;
        const { nombre } = req.body;

        if (user.rol === "usuario") {
            if (!["3ro", "4to"].includes(user.nivel)) {
                return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
            }
            if (
                !user.especialidad
                || !["Mecánica automotriz", "Electricidad", "Electrónica"].includes(user.especialidad)
            ) {
                return handleErrorClient(
                    res,
                    403,
                    "El usuario debe tener una especialidad válida para realizar esta acción."
                );
            }
        }

        const archivoNuevo = req.file ? req.file.path : null;
        const hostUrl = `${req.protocol}://${req.get("host")}`;
        const especialidad = req.body.especialidad || (user.rol === "usuario" ? user.especialidad : null);

        const [resultado, error] = await modificarDocumentoService(
            user,
            documentoId,
            archivoNuevo,
            hostUrl,
            periodoPracticaId,
            especialidad,
            nombre
        );

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

        if (user.rol === "usuario") {
            if (!["3ro", "4to"].includes(user.nivel)) {
                return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
            }
            if (!user.especialidad
                || !["Mecánica automotriz", "Electricidad", "Electrónica"].includes(user.especialidad)) {
                return handleErrorClient(res, 403,
                    "El usuario debe tener una especialidad válida para realizar esta acción.");
            }
        }
        const [documentos, error] = await verDocumentosService(user);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Documentos obtenidos correctamente", documentos);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener los documentos");
    }
}

export async function obtenerTodosDocumentos(req, res) {
    try {
        const user = req.user;

        if (user.rol === "usuario") {
            if (!["3ro", "4to"].includes(user.nivel)) {
                return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
            }
            if (!user.especialidad
                || !["Mecánica automotriz", "Electricidad", "Electrónica"].includes(user.especialidad)) {
                return handleErrorClient(res, 403,
                    "El usuario debe tener una especialidad válida para realizar esta acción.");
            }
        }

        const [documentos, error] = await obtenerTodosDocumentosService(user);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documentos obtenidos correctamente.", documentos);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo los documentos.");
    }
}
