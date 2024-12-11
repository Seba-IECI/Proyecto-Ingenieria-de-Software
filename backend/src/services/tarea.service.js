"use strict";
import Tarea from "../entity/tarea.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearTareaService(query){
    try{
        const { titulo, descripcion, fecha_entrega } = query;
        const tareaRepository = AppDataSource.getRepository(Tarea);

        const tareaExistente = await tareaRepository.findOne({ where: { titulo } });
        if (tareaExistente) {
            return [null, "Ya existe una tarea con ese título"];
        }
    
        const nuevaTarea = tareaRepository.create({
            titulo,
            descripcion,
            fecha_entrega,
            createdAt: new Date(),
        });

        await tareaRepository.save(nuevaTarea);
        return [nuevaTarea, null];
    } catch (error){
        console.error("Error al crear la tarea:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function habilitarTareaService(query) {
    try {
        const { id } = query;
        const tareaRepository = AppDataSource.getRepository(Tarea);
        const tareaFound = await tareaRepository.findOne({
            where: { id: id },
        });

        if (!tareaFound) return [null, "Tarea no encontrada"];

        await tareaRepository.update(id, { habilitada: true });
        return [await tareaRepository.findOne({ where: { id: id } }), null];
    } catch (error) {
        console.error("Error al habilitar la tarea:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deshabilitarTareaService(query) {
    try {
        const { id } = query;
        const tareaRepository = AppDataSource.getRepository(Tarea);
        const tareaFound = await tareaRepository.findOne({
            where: { id: id },
        });

        if (!tareaFound) return [null, "Tarea no encontrada"];

        await tareaRepository.update(id, { habilitada: false });
        return [await tareaRepository.findOne({ where: { id: id } }), null];
    } catch (error) {
        console.error("Error al deshabilitar la tarea:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getTareaService(){
    try{
        const tareas = await AppDataSource.getRepository(Tarea).find();

        if(tareas.length === 0) return [null, "No se encontraron tareas"];
        return [tareas, null];
    } catch (error){
        console.error("Error al obtener las tareas:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateTareaService(query, body) {
    try {
        const { id } = query;
        const { titulo } = body;
        const tareaRepository = AppDataSource.getRepository(Tarea);

        const tareaFound = await tareaRepository.findOne({
            where: { id: id },
        });

        if (!tareaFound) return [null, "Tarea no encontrada"];

        const tareaWithSameTitle = await tareaRepository.findOne({
            where: { titulo: titulo },
        });

        if (tareaWithSameTitle) return [null, "Ya existe una tarea con ese título"];

        await tareaRepository.update(id, body);
        return [await tareaRepository.findOne({ where: { id: id } }), null];
    } catch (error) {
        console.error("Error al actualizar la tarea:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteTareaService(query){
    try{
        const { id } = query;
        const tareaRepository = AppDataSource.getRepository(Tarea);
        const tareaFound = await tareaRepository.findOne({
            where: [{ id: id }],
        });

        if(!tareaFound) return [null, "Tarea no encontrada"];

        await tareaRepository.delete(id);
        return [tareaFound, null];

    } catch (error){
        console.error("Error al eliminar la tarea:", error);
        return [null, "Error interno del servidor"];
    }   
}