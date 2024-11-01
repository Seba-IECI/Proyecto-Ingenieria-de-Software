"use strict";

import { subirDocumentoService } from "../services/documentosPractica.service.js";

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