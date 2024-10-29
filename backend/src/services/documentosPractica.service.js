"use strict";
import fs from "fs";
import { AppDataSource } from "../config/configDb.js";
import DocumentosPractica from "../entity/documentosPractica.entity.js";

export async function subirDocumentoService(user, archivoPath, fechaLimite) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);
        const nuevoDocumento = documentoRepository.create({
            documento: archivoPath,
            fechaLimite,
            alumnoId: user.rol === "usuario" ? user.id : null,
            profesorId: user.rol === "administrador" ? user.id : null,
        });


        await documentoRepository.save(nuevoDocumento);
        return [nuevoDocumento, null];

    } catch (error) {
        return [null, "Error interno del servidor"];
    }
}

export async function eliminarDocumentoService(user, documentoId) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);
        const documento = await documentoRepository.findOne({
            where: { id: documentoId, profesorId: user.id }
        });
        if (!documento) {
            return [null, "Documento no encontrado o el usuario no tiene permisos para eliminarlo"];
        }

        fs.unlink(documento.documento,(err) => {
            if (err) console.error("Error al eliminar el archivo:", err);
        });
        await documentoRepository.remove(documento);

        return [true, null];
    } catch (error) {
        return [null, "Error al eliminar el documento"];
    }
}
