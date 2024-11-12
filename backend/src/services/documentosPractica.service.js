"use strict";
import fs from "fs";
import { AppDataSource } from "../config/configDb.js";
import DocumentosPractica from "../entity/documentosPractica.entity.js";

export async function subirDocumentoService(user, archivoPath) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);
        const nuevoDocumento = documentoRepository.create({
            documento: archivoPath,
            alumnoId: user.rol === "usuario" ? user.id : null,
            profesorId: user.rol === "administrador" ? user.id : null,
        });

        await documentoRepository.save(nuevoDocumento);
        return [nuevoDocumento, null];
    } catch (error) {
        console.error("Error en subirDocumentoService:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function eliminarDocumentoService(user, documentoId, req) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);

        const whereClause = user.rol === "usuario"
            ? { id: documentoId, alumnoId: user.id }
            : { id: documentoId, profesorId: user.id };

        const documento = await documentoRepository.findOne({ where: whereClause });

        if (!documento) {
            return [null, "Documento no encontrado o el usuario no tiene permisos para eliminarlo"];
        }
        
        const filePath = documento.documento.replace(`${req.protocol}://${req.get("host")}/`, "");

        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log("Archivo eliminado:", filePath);
            } catch (err) {
                console.error("Error al eliminar el archivo:", err);
            }
        } else {
            console.warn("El archivo no existe en el sistema:", filePath);
        }
        await documentoRepository.remove(documento);

        return [true, null];
    } catch (error) {
        console.error("Error al eliminar el documento:", error);
        return [null, "Error al eliminar el documento"];
    }
}

export async function modificarDocumentoService(user, documentoId, archivoNuevo, hostUrl) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);

        // Buscar el documento en la base de datos
        const documento = await documentoRepository.findOne({
            where: [
                { id: documentoId, alumnoId: user.id },
                { id: documentoId, profesorId: user.id }
            ]
        });
        // Si hay un nuevo archivo, eliminar el anterior y actualizar la ruta
        if (archivoNuevo) {
            const previousFilePath = documento.documento.replace(`${hostUrl}/`, "");

            // Verificar si el archivo anterior existe antes de eliminarlo
            if (fs.existsSync(previousFilePath)) {
                try {
                    fs.unlinkSync(previousFilePath);
                    console.log("Archivo anterior eliminado:", previousFilePath);
                } catch (err) {
                    console.error("Error al eliminar el archivo anterior:", err);
                }
            }

            // Actualizar el campo documento con la nueva ruta
            documento.documento = archivoNuevo;
        }

        // Guardar los cambios en la base de datos
        await documentoRepository.save(documento);

        return [documento, null];
    } catch (error) {
        console.error("Error en modificarDocumentoService:", error);
        return [null, "Error al modificar el documento"];
    }
}

export async function obtenerTodosDocumentosService() {
    try {
        const documentosRepository = AppDataSource.getRepository(DocumentosPractica);

        const documentos = await documentosRepository.find();

        if (!documentos.length) {
            return [null, "No se encontraron documentos."];
        }

        return [documentos, null];
    } catch (error) {
        console.error("Error al obtener documentos:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function verDocumentosService(user) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);  
        const whereClause = user.rol === "administrador"
            ? { profesorId: user.id }
            : { alumnoId: user.id };

        const documentos = await documentoRepository.find({ where: whereClause });


        if (!documentos.length) {
            return [null, "No se encontraron documentos subidos por el profesor"];
        }
        return [documentos, null];
    } catch (error) {
        console.error("Error en verDocumentosProfesorService:", error);
        return [null, "Error al obtener los documentos del profesor"];
    }
}