"use strict";
import { subirDocTareaService, obtenerDocumentosService } from "../services/documentosTarea.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function subirDocumentoTarea(req, res) {
    try {
        const user = req.user;

        if (!req.file) {
            return handleErrorClient(res, 400, "No se ha subido ningún archivo");
        }

        const archivoPath = req.file.path;
        const nombre = req.file.originalname;
        const [nuevoDocumentoTarea, error] = await subirDocTareaService(user, archivoPath,nombre);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documento subido correctamente.", nuevoDocumentoTarea);
    } catch (error) {
        handleErrorServer(res, 500, "Error subiendo el documento.");
    }
}

export async function obtenerDocumentos(req, res) {
    try {
        
        
        const [documentosTarea, error] = await obtenerDocumentosService();

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documentos obtenidos correctamente.", documentosTarea);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo los documentos.");
    }
}