"use strict";

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

export async function obtenerDocumentosService() {
    try {
        const documentosRepository = AppDataSource.getRepository(DocumentosPractica);
        const documentos = await documentosRepository.find({ relations: ["alumno", "profesor"] });
        return [documentos, null];
    } catch (error) {
        console.error("Error al obtener documentos:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function obtenerDocumentoPorIdService(id) {
    try {
        const documentosRepository = AppDataSource.getRepository(DocumentosPractica);
        const documento = await documentosRepository.findOne({ 
            where: { id } 
        });

        if (!documento) {
            return [null, "Documento no encontrado"];
        }
        return [documento, null];
    } catch (error) {
        console.error("Error al obtener el documento:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function actualizarDocumentoService(id, body) {
    try {
        const documentosRepository = AppDataSource.getRepository(DocumentosPractica);
        const documento = await documentosRepository.findOne({ where: { id } });

        if (!documento) {
            return [null, "Documento no encontrado"];
        }
      
        documento.documento = body.documento || documento.documento;
        documento.fechaLimite = body.fechaLimite || documento.fechaLimite;

      
        await documentosRepository.save(documento);
        return [documento, null];
    } catch (error) {
        console.error("Error al actualizar el documento:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function eliminarDocumentoService(id) {
    try {
        const documentosRepository = AppDataSource.getRepository(DocumentosPractica);
        const documento = await documentosRepository.findOne({ where: { id } });

        if (!documento) {
            return [null, "Documento no encontrado"];
        }

        await documentosRepository.remove(documento);
        return [true, null]; 
    } catch (error) {
        console.error("Error al eliminar el documento:", error);
        return [null, "Error interno del servidor"];
    }
}

