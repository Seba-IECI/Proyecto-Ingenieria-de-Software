"use strict";

import { subirDocumentoService } from "../services/documentosPractica.service.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";


export async function subirDocumentoPractica(req, res) {
    try {
        const { documento, fechaLimite } = req.body;
        const user = req.user;

        const [nuevoDocumento, error] = await subirDocumentoService(user, documento, fechaLimite);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Documento subido correctamente.", nuevoDocumento);
    } catch (error) {
        handleErrorServer(res, 500, "Error subiendo el documento.");
    }
}
