"use strict";
import { AppDataSource } from "../config/configDb.js";
import DocumentosTarea from "../entity/documentosTarea.entity.js";


export async function subirDocTareaService( userId,archivoPath, nombre) {
    try {
        const documentoTareaRepository = AppDataSource.getRepository(DocumentosTarea);
        
        console.log("Ruta del archivo:", archivoPath);
        const nuevoDocumentoTarea = documentoTareaRepository.create({ 
            archivo: archivoPath, 
            nombre,
            user: userId,
        });
        console.log("Documento a guardar:", nuevoDocumentoTarea);

        await documentoTareaRepository.save(nuevoDocumentoTarea);
        console.log("Documento guardado correctamente en la base de datos:", nuevoDocumentoTarea);

        return [nuevoDocumentoTarea, null];
    } catch (error) {
        console.error("Error en subirDocTareaService:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function obtenerDocumentosService() {
    try {
        
        const documentoTareaRepository = AppDataSource.getRepository(DocumentosTarea);

        const documentosTarea = await documentoTareaRepository.find({ relations: ["user"] });

        return [documentosTarea, null];

    } catch (error) {
        console.error("Error al obtener los documentos:", error);
        return [null, "Error interno del servidor"];
    }
}












