"use strict";
import fs from "fs";
import { AppDataSource } from "../config/configDb.js";
import DocumentosPractica from "../entity/documentosPractica.entity.js";

export async function subirDocumentoService(user, archivoPath, fechaLimite) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);

        //creamos los nuevos documento con los datos correspondientes a cada rol
        const nuevoDocumento = documentoRepository.create({
            documento: archivoPath,
            fechaLimite: user.rol === "administrador" ? fechaLimite : null,//Solo el profesor define fechaLimite
            alumnoId: user.rol === "usuario" ? user.id : null,
            profesorId: user.rol === "administrador" ? user.id : null,
        });

        await documentoRepository.save(nuevoDocumento);
        return [nuevoDocumento, null];

    } catch (error) {
        return [null, "Error interno del servidor"];
    }
}

