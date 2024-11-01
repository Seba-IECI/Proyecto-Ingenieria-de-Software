"use strict";
import Materia from "../entity/materia.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function subirMaterialService(query) {
    try {
        const { titulo, descripcion, url } = query;
        const materiaRepository = AppDataSource.getRepository(Materia);

        
        const nuevoMaterial = materiaRepository.create({
            titulo,
            descripcion,
            url,
            createdAt: new Date() 
        });

       
        await materiaRepository.save(nuevoMaterial);

        return [nuevoMaterial, null];
    } catch (error) {
        console.error("Error al subir material:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getMateriaService(query) {
    try {
        const { id } = query;
        const materiaFound = await AppDataSource.getRepository(Materia).findOne({
            where: [{ id: id }],
        });

        if (!materiaFound) return [null, "Materia no encontrada"];
        return [materiaFound, null];
    } catch (error) {
        console.error("Error al obtener la materia:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateMateriaService(query, body) {
    try {
        const { id } = query;
        const materiaRepository = AppDataSource.getRepository(Materia);
        const materiaFound = await materiaRepository.findOne({
            where: [{ id: id }],
        });

        if (!materiaFound) return [null, "Materia no encontrada"];

        
        await materiaRepository.update(id, body);
        return [await materiaRepository.findOneBy({ id }), null];
    } catch (error) {
        console.error("Error al actualizar la materia:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteMateriaService(query) {
    try {
        const { id } = query;
        const materiaRepository = AppDataSource.getRepository(Materia);
        const materiaFound = await materiaRepository.findOne({
            where: [{ id: id }],
        });

        if (!materiaFound) return [null, "Materia no encontrada"];

        const materiaDeleted = await materiaRepository.remove(materiaFound);
        
      
        return [materiaFound, null];
    } catch (error) {
        console.error("Error al eliminar la materia:", error);
        return [null, "Error interno del servidor"];
    }
}