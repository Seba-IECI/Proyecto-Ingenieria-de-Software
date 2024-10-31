"use strict";
import fs from "fs";
//import { IsNull, Not } from "typeorm";
import { AppDataSource } from "../config/configDb.js";
import DocumentosPractica from "../entity/documentosPractica.entity.js";

//IMPORTANTE: Esto es para el alumno, la mayoria de los cambios no tienen la restriccion BIEN HECHA de la fechaLimite ya que
//se tiene que propocionar por el profesor, OJO! Esto es funcional PARA PRUEBAS

/*
validaciones a hacer: 
1. Esto es para el alumno y solo el alumno LISTO!! 

VA A SER GENERAL!!!

2. El profesor debe poner fechaLimite Y SOLO EL PROFESOR LO PUEDE MODIFICAR, osea, en el documento de subida del profesor
se deja estipulada la fecha limite, y en estos documentos no deberia de encontrarse como una variable a modificar

3. En TODOS los documentos deberia salir la ID del profesor encargado / MMMM, podria cambiarse, ya que se deberia verificar si es que la ID
se podria pegar de una cuando se sube el archivo, lo cual seria complejisisisimo


5. El alumno no puede modificar fechaLimite


*/
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


export async function eliminarDocumentoService(user, documentoId) { //validar fecha falta
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica); //modificar la entidad en la bd

        // Filtrar según el rol: buscar el documento por ID y validar al propietario
        const whereClause = user.rol === "usuario" ? {
            id: documentoId, alumnoId: user.id
        } : {
            id: documentoId, profesorId: user.id
        };
        const documento = await documentoRepository.findOne({ where: whereClause });
        // id: documentoId: Buscar un documento el cual su id coincide con el documentoId q se proporciona

        // alumnoId: user.id: filtra que solo se encuentre documento si alumnoId coincida con la id del usuario atenticado, osea user.id


        if (!documento) {
            return [null, "Documento no encontrado o el usuario no tiene permisos para eliminarlo"];
        }

        fs.unlink(documento.documento, (err) => {
            if (err) console.error("Error al eliminar el archivo:", err);
        });
        await documentoRepository.remove(documento);
        //fs.unlink elimina archivo asociado al documento en el sistema de archivos, la ruta que se va a aeliminar esta en
        //documento.documento!!! si hay error, ocupa el err
        //y despues usamos el documentoRepository para eliminar el registro del documento en la bd


        return [true, null];
    } catch (error) {
        return [null, "Error al eliminar el documento"];
    }
}

export async function modificarDocumentoService(user, documentoId, fechaLimite, archivoNuevo) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);

        //verifica si el documento pertenece al usuario o profesor que lo está modificando
        const documento = await documentoRepository.findOne({
            where: [
                { id: documentoId, alumnoId: user.id },
                { id: documentoId, profesorId: user.id }
            ]
        });

        if (!documento) {
            return [null, "Documento no encontrado o el usuario no tiene permisos para modificarlo"];
        }

        /* Verifica la fecha límite solo si es alumno ERROR
        const fechaActual = new Date();
        if (user.rol === "usuario" && fechaActual > new Date(documento.fechaLimite)) {
            return [null, "No se puede modificar el documento porque ha pasado la fecha límite"];
        }*/


        if (archivoNuevo) {
            fs.unlink(documento.documento, (err) => {
                if (err) console.error("Error al eliminar el archivo anterior:", err);
            });
            documento.documento = archivoNuevo;
        } //si hay un archivo nuevo, entonces eliminar el anterior y así actualizar el campo 'documento'


        //actualizar la fecha límite si el usuario es profesor y proporciona una nueva fecha
        if (user.rol === "administrador" && fechaLimite) {
            documento.fechaLimite = fechaLimite;
        }

        await documentoRepository.save(documento);

        return [documento, null];
    } catch (error) {
        console.error("Error en modificarDocumentoService:", error);
        return [null, "Error al modificar el documento"];
    }
}

export async function verDocumentosService(user) {
    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);

        /*
        const documentos = await documentoRepository.find({
            where: { profesorId: Not(IsNull()) } //Buscar documentos con un profesor asignado
        }); 
        */

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