"use strict";
import Materia from "../entity/materia.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function subirMaterialService(query) {
    try {
        const { titulo, descripcion, url } = query;
        const materiaRepository = AppDataSource.getRepository(Materia);

        const materiaExistente = await materiaRepository.findOne({ where: { titulo } });
        if (materiaExistente) {
            return [null, "Ya existe una materia con ese título"];
        }
        
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

export async function getMateriaService() {
    try {
        const materias = await AppDataSource.getRepository(Materia).find();

        if (materias.length === 0) return [null, "No se encontraron materias"];
        return [materias, null];
    } catch (error) {
        console.error("Error al obtener las materias:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateMateriaService(query, body) {
    try {
        const { id } = query;
        const { titulo } = body;
        const materiaRepository = AppDataSource.getRepository(Materia);
        const materiaFound = await materiaRepository.findOne({
            where: { id },
        });

        if (!materiaFound) return [null, "Materia no encontrada"];

        const materiaConMismoTitulo = await materiaRepository.findOne({
            where: { titulo },
        });

        if (materiaConMismoTitulo && materiaConMismoTitulo.id !== id) {
            return [null, "Ya existe una materia con ese título"];
        }
        
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