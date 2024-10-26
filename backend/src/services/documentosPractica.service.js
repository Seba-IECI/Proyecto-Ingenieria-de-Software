"use strict";

import { AppDataSource } from "../config/configDb";
import DocumentosPractica from "../entity/documentosPractica.entity";

export async function subirDocumentoService(user, documento, fechaLimite) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);
        const nuevoDocumento = documentoRepository.create({
            documento,
            fechaLimite,
            tipoUsuario: user.rol === "administrador" ? "profesor" : "alumno",
            alumnoId: user.rol === "usuario" ? user.id : null,
            profesorId: user.rol === "administrador" ? user.id : null,
        });


        await documentoRepository.save(nuevoDocumento);
        return [nuevoDocumento, null];

    } catch (error) {
        return [null, "Error interno del servidor"];
    }
}