"use strict";

import { AppDataSource } from "../config/configDb.js";
import AsistenciaSchema from "../entity/asistencia.entity.js";
import SemestreSchema from "../entity/semestre.entity.js";
import User from "../entity/user.entity.js";
import { Between } from "typeorm";

export async function registrarAsistenciaService(user, alumnoId, semestreId, fecha, presente) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
        const semestreRepository = AppDataSource.getRepository(SemestreSchema);
        const userRepository = AppDataSource.getRepository(User);

        const alumno = await userRepository.findOneBy({ id: alumnoId });
        if (!alumno || alumno.rol !== "usuario") {
            return [null, "El alumno no existe o no tiene el rol correcto."];
        }

        const semestre = await semestreRepository.findOneBy({ id: semestreId });
        if (!semestre) {
            return [null, "El semestre no existe."];
        }

        if (!semestre.estado) {
            return [null, "No se puede registrar asistencia porque el semestre no está activo."];
        }

        if (isNaN(Date.parse(fecha))) {
            return [null, "La fecha proporcionada no es válida."];
        }

        const fechaAsistencia = new Date(fecha);
        const fechaInicioSemestre = new Date(semestre.fechaInicio);
        const fechaFinSemestre = new Date(semestre.fechaFin);

        if (fechaAsistencia < fechaInicioSemestre || fechaAsistencia > fechaFinSemestre) {
            return [null, "La fecha está fuera del rango del semestre."];
        }

        const asistenciaDuplicada = await asistenciaRepository.findOne({
            where: {
                alumno: { id: alumnoId },
                semestre: { id: semestreId },
                fecha,
                profesor: { id: user.id },
            },
        });

        if (asistenciaDuplicada) {
            return [null, "Ya existe un registro de asistencia para este alumno en la misma fecha y semestre."];
        }

        const nuevaAsistencia = asistenciaRepository.create({
            fecha,
            presente,
            alumno: { id: alumnoId },
            semestre: { id: semestreId },
            profesor: { id: user.id },
        });

        await asistenciaRepository.save(nuevaAsistencia);
        return [nuevaAsistencia, null];
    } catch (error) {
        console.error("Error en registrarAsistenciaService:", error);
        return [null, "Error al registrar la asistencia."];
    }
}

export async function listarAsistenciasService(semestreId, alumnoId, startDate, endDate) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

        const whereClause = {};
        if (semestreId) whereClause.semestre = { id: semestreId };
        if (alumnoId) whereClause.alumno = { id: alumnoId };

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return [null, "Las fechas proporcionadas no son válidas"];
            }

            whereClause.fecha = Between(startDate, endDate);
        }

        const asistencias = await asistenciaRepository.find({
            where: whereClause,
            relations: ["alumno", "semestre", "profesor"],
        });

        if (!asistencias.length) {
            return [null, "No se encontraron asistencias"];
        }

        const cleanedAsistencias = asistencias.map(asistencia => ({
            id: asistencia.id,
            fecha: asistencia.fecha,
            presente: asistencia.presente,
            createdAt: asistencia.createdAt,
            updatedAt: asistencia.updatedAt,
            alumno: {
                id: asistencia.alumno.id,
                nombreCompleto: asistencia.alumno.nombreCompleto,
                rut: asistencia.alumno.rut,
                email: asistencia.alumno.email,
            },
            semestre: {
                id: asistencia.semestre.id,
                nombre: asistencia.semestre.nombre,
                fechaInicio: asistencia.semestre.fechaInicio,
                fechaFin: asistencia.semestre.fechaFin,
                estado: asistencia.semestre.estado,
                descripcion: asistencia.semestre.descripcion,
            },
            profesor: {
                id: asistencia.profesor.id,
                nombreCompleto: asistencia.profesor.nombreCompleto,
                email: asistencia.profesor.email,
            },
        }));

        return [cleanedAsistencias, null];
    } catch (error) {
        console.error("Error en listarAsistenciasService:", error);
        return [null, "Error al listar asistencias"];
    }
}

export async function obtenerAsistenciaPorIdService(id, user) {
    try {
        if (!id || isNaN(id)) {
            return [null, "ID de asistencia no válido"];
        }

        const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

        const asistencia = await asistenciaRepository.findOne({
            where: { id },
            relations: ["alumno", "semestre", "profesor"],
        });

        if (!asistencia) {
            return [null, "Asistencia no encontrada"];
        }

        const fechaAsistencia = new Date(asistencia.fecha);
        const fechaInicioSemestre = new Date(asistencia.semestre.fechaInicio);
        const fechaFinSemestre = new Date(asistencia.semestre.fechaFin);

        if (fechaAsistencia < fechaInicioSemestre || fechaAsistencia > fechaFinSemestre) {
            return [null, "La fecha de la asistencia está fuera del rango del semestre"];
        }

        const cleanedAsistencia = {
            id: asistencia.id,
            fecha: asistencia.fecha,
            presente: asistencia.presente,
            createdAt: asistencia.createdAt,
            updatedAt: asistencia.updatedAt,
            alumno: {
                id: asistencia.alumno.id,
                nombreCompleto: asistencia.alumno.nombreCompleto,
                rut: asistencia.alumno.rut,
                email: asistencia.alumno.email,
            },
            semestre: {
                id: asistencia.semestre.id,
                nombre: asistencia.semestre.nombre,
                fechaInicio: asistencia.semestre.fechaInicio,
                fechaFin: asistencia.semestre.fechaFin,
                estado: asistencia.semestre.estado,
                descripcion: asistencia.semestre.descripcion,
            },
            profesor: {
                id: asistencia.profesor.id,
                nombreCompleto: asistencia.profesor.nombreCompleto,
                email: asistencia.profesor.email,
            },
        };

        return [cleanedAsistencia, null];
    } catch (error) {
        console.error("Error en obtenerAsistenciaPorIdService:", error);
        return [null, "Error al obtener la asistencia"];
    }
}
