"use strict";

/* El encargado de practica es un usuario solo que con otros roles*/

import {
    eliminarDocumentoService,
    modificarDocumentoService,
    subirDocumentoService
} from "../services/documentosPractica.service.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function subirDocumentoPractica(req, res) {
    try {
        const user = req.user;

        // Validación específica para alumnos
        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }

        if (!req.file) {
            return handleErrorClient(res, 400, "No se ha subido ningún archivo");
        }

        // Validación para requerir fechaLimite solo si es profesor
        const fechaLimite = user.rol === "administrador" ? req.body.fechaLimite : null;

        if (user.rol === "administrador" && !fechaLimite) {
            return handleErrorClient(res, 400, "El campo fechaLimite es obligatorio para el profesor.");
        }

        const archivoPath = req.file.path;

        const [nuevoDocumento, error] = await subirDocumentoService(user, archivoPath, fechaLimite);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Documento subido correctamente.", nuevoDocumento);
    } catch (error) {
        handleErrorServer(res, 500, "Error subiendo el documento.");
    }
}


//documento el eliminar nose si alcance a hacer los demas tan pronto, Seba
export async function eliminarDocumentoPractica(req, res) {
    try {
        const documentoId = req.params.id;
        const user = req.user;

        // Si es alumno, valida el nivel
        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }

        const [resultado, error] = await eliminarDocumentoService(user, documentoId);

        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Documento eliminado correctamente.");
    } catch (error) {
        handleErrorServer(res, 500, "Error eliminando el documento.");
    }
}


export async function modificarDocumentoPractica(req, res) {
    try {
        const documentoId = req.params.id; //id del documento q se va a modificar que se ubica ahora en req.params.id
        const user = req.user;//se autentifica el usuario si es alumno o si el profesor

        if (user.rol === "usuario" && !["3ro", "4to"].includes(user.nivel)) {
            return handleErrorClient(res, 403, "Solo los alumnos de 3ro o 4to año pueden realizar esta acción.");
        }

        const fechaLimite = user.rol === "administrador" ? req.body.fechaLimite : null;
        //extraemos la fecha limit del objeto req.body si el usuario es profesor
        const archivoNuevo = req.file ? req.file.path : null;
        //ESTO ES PARA VERIFICAR SI EXISTE EL REQ.FILE!!
        //req.file lo crea el Multer por si aca, el path es la ruta de almacenamiento en el servidor
        // ? es un operador terniario, si req.file existe, archivoNuevo se asigna a req.file.path, donde se guardo el archivo en el servidor
        //si req.file no existe, archivoNuevo se le asigna a null que indica que no se subio ningun archivo



        const [resultado, error] = await modificarDocumentoService(user, documentoId, fechaLimite, archivoNuevo);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Documento modificado correctamente.", resultado);
    } catch (error) {
        handleErrorServer(res, 500, "Error modificando el documento.");
    }
}

