"use strict";
import fs from "fs";
import { AppDataSource } from "../config/configDb.js";
import DocumentosPractica from "../entity/documentosPractica.entity.js";

export async function subirDocumentoService(user, archivoPath, periodoPracticaId, especialidad, nombre) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);
        const nuevoDocumento = documentoRepository.create({
            documento: archivoPath,
            nombre: nombre,
            alumnoId: user.rol === "usuario" ? user.id : null,
            encargadoPracticasId: user.rol === "encargadoPracticas" ? user.id : null,
            periodoPractica: { id: periodoPracticaId },
            especialidad: especialidad,
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

        if (user.rol === "usuario" || user.rol === "encargadoPracticas") {
            const criteria = user.rol === "usuario"
                ? { id: documentoId, alumnoId: user.id }
                : { id: documentoId, encargadoPracticasId: user.id };

            const documento = await documentoRepository.findOne({ where: criteria });

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
        }

        return [null, "No tienes permiso para realizar esta acción"];
    } catch (error) {
        console.error("Error al eliminar el documento:", error);
        return [null, "Error al eliminar el documento"];
    }
}

export async function modificarDocumentoService(
    user, documentoId, archivoNuevo, hostUrl, periodoPracticaId, especialidad, nombre) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);

        const criteria = user.rol === "usuario"
            ? { id: documentoId, alumnoId: user.id }
            : { id: documentoId, encargadoPracticasId: user.id };

        const documento = await documentoRepository.findOne({ where: criteria });

        if (!documento) {
            return [null, "Documento no encontrado o el usuario no tiene permisos para modificarlo"];
        }

        if (archivoNuevo) {
            const previousFilePath = documento.documento.replace(`${hostUrl}/`, "");

            if (fs.existsSync(previousFilePath)) {
                try {
                    fs.unlinkSync(previousFilePath);
                    console.log("Archivo anterior eliminado:", previousFilePath);
                } catch (err) {
                    console.error("Error al eliminar el archivo anterior:", err);
                }
            }

            documento.documento = archivoNuevo;
        }

        if (!documento.periodoPractica) {
            documento.periodoPractica = { id: periodoPracticaId };
        }

        if (user.rol === "encargadoPracticas" && especialidad) {
            documento.especialidad = especialidad;
        }

        if (nombre !== undefined) {
            documento.nombre = nombre;
        }

        documento.updatedAt = new Date();
        await documentoRepository.save(documento);

        return [documento, null];
    } catch (error) {
        console.error("Error en modificarDocumentoService:", error);
        return [null, "Error al modificar el documento"];
    }
}


export async function obtenerTodosDocumentosService(user) {
    try {
        const documentosRepository = AppDataSource.getRepository(DocumentosPractica);

        if (user.rol === "usuario" || user.rol === "encargadoPracticas") {
            const criteria = user.rol === "usuario"
                ? { alumnoId: user.id }
                : { encargadoPracticasId: user.id };

            const documentos = await documentosRepository.find({ where: criteria });

            if (!documentos.length) {
                return [null, "No se encontraron documentos."];
            }

            return [documentos, null];
        }

        return [null, "No tienes permiso para realizar esta acción"];
    } catch (error) {
        console.error("Error al obtener documentos:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function verDocumentosService(user) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);

        if (user.rol === "usuario" || user.rol === "encargadoPracticas") {
            const criteria = user.rol === "usuario"
                ? { alumnoId: user.id }
                : { encargadoPracticasId: user.id };

            const documentos = await documentoRepository.find({ where: criteria });

            if (!documentos.length) {
                return [null, "No se encontraron documentos relacionados con este usuario"];
            }

            return [documentos, null];
        }

        return [null, "No tienes permiso para realizar esta acción"];
    } catch (error) {
        console.error("Error en verDocumentosService:", error);
        return [null, "Error al obtener los documentos"];
    }
}