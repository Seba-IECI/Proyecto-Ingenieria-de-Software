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

export async function listarAsistenciasService(semestreId, alumnoId, startDate, endDate, profesorId) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

        const whereClause = { profesor: { id: profesorId } };

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
            order: {
                fecha: "ASC",
            },
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

export async function obtenerAsistenciaPorIdService(asistenciaId, profesorId, alumnoId = null) {
    try {
        const whereClause = { id: asistenciaId, profesor: { id: profesorId } };

        if (alumnoId) {
            whereClause.alumno = { id: alumnoId };
        }

        const asistencia = await AppDataSource.getRepository(AsistenciaSchema).findOne({
            where: whereClause,
            relations: ["alumno", "semestre", "profesor"],
        });

        if (!asistencia) {
            return [null, "Asistencia no encontrada o no pertenece al alumno/profesor solicitado"];
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

export async function validarAlumnoPorProfesorService(alumnoId, profesorId) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
        const asistencia = await asistenciaRepository.findOne({
            where: { alumno: { id: alumnoId }, profesor: { id: profesorId } },
            relations: ["alumno", "profesor"],
        });

        if (!asistencia) {
            return [null, "El alumno no está asociado al profesor actual"];
        }

        return [true, null];
    } catch (error) {
        console.error("Error en validarAlumnoPorProfesorService:", error);
        return [null, "Error al validar la relación profesor-alumno"];
    }
}

export async function calcularPorcentajeAsistenciaService(alumnoId, semestreId) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
        const semestreRepository = AppDataSource.getRepository(SemestreSchema);
        const userRepository = AppDataSource.getRepository(User);

        const alumno = await userRepository.findOneBy({ id: alumnoId });
        if (!alumno || alumno.rol !== "usuario") {
            return [null, "El alumno no existe o no tiene el rol correcto"];
        }

        const semestre = await semestreRepository.findOneBy({ id: semestreId });
        if (!semestre) {
            return [null, "El semestre no existe"];
        }

        if (!semestre.estado) {
            return [null, "El semestre no está activo"];
        }

        const asistencias = await asistenciaRepository.find({
            where: {
                alumno: { id: alumnoId },
                semestre: { id: semestreId },
            },
        });

        if (!asistencias.length) {
            return [null, "No se encontraron registros de asistencia para este alumno en este semestre"];
        }

        const asistenciasTotales = asistencias.length;
        const asistenciasPresentes = asistencias.filter((asistencia) => asistencia.presente).length;

        const porcentaje = (asistenciasPresentes / asistenciasTotales) * 100;

        return [porcentaje.toFixed(2), null];
    } catch (error) {
        console.error("Error en calcularPorcentajeAsistenciaService:", error);
        return [null, "Error al calcular el porcentaje de asistencia"];
    }
}

export async function actualizarAsistenciaService(id, presente) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
        if (typeof presente !== "boolean") {
            return [null, "El valor de 'presente' debe ser booleano"];
        }

        const asistencia = await asistenciaRepository.findOne({
            where: { id },
            relations: ["alumno", "semestre", "profesor"],
        });

        if (!asistencia) {
            return [null, "Asistencia no encontrada"];
        }

        if (asistencia.presente === presente) {
            return [null, "No se realizaron cambios, el estado ya es el mismo"];
        }

        asistencia.presente = presente;
        await asistenciaRepository.save(asistencia);

        const updatedAsistencia = {
            id: asistencia.id,
            fecha: asistencia.fecha,
            presente: asistencia.presente,
            alumno: {
                id: asistencia.alumno.id,
                nombreCompleto: asistencia.alumno.nombreCompleto,
                email: asistencia.alumno.email,
            },
            semestre: {
                id: asistencia.semestre.id,
                nombre: asistencia.semestre.nombre,
            },
            profesor: {
                id: asistencia.profesor.id,
                nombreCompleto: asistencia.profesor.nombreCompleto,
            },
        };

        return [updatedAsistencia, null];
    } catch (error) {
        console.error("Error en actualizarAsistenciaService:", error);
        return [null, "Error al actualizar la asistencia"];
    }
}
