"use strict";
import { AppDataSource } from "../config/configDb.js";
import SemestreSchema from "../entity/semestre.entity.js";
import { Between, Not } from "typeorm";

async function validarFechasSemestre(fechaInicio, fechaFin, semestreRepository, id = null, estado = false) {
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
        return "La fecha de inicio debe ser anterior a la fecha de fin";
    }

    const yearInicio = new Date(fechaInicio).getFullYear();
    const yearFin = new Date(fechaFin).getFullYear();

    if (yearInicio !== yearFin) {
        return "El año de inicio y fin deben ser el mismo";
    }

    const mesInicio = new Date(`${fechaInicio}T00:00:00Z`).getUTCMonth();
    const mesFin = new Date(`${fechaFin}T00:00:00Z`).getUTCMonth();

    if (
        !((mesInicio >= 2 && mesInicio <= 6 && mesFin >= 2 && mesFin <= 6)
            || (mesInicio >= 7 && mesInicio <= 11 && mesFin >= 7 && mesFin <= 11))
    ) {
        return "Fechas fuera del rango permitido";
    }

    const semestresSolapados = await semestreRepository.find({
        where: [
            { fechaInicio: Between(fechaInicio, fechaFin), id: id ? Not(id) : undefined },
            { fechaFin: Between(fechaInicio, fechaFin), id: id ? Not(id) : undefined }
        ]
    });

    if (semestresSolapados.length > 0) {
        return "Ya existe un semestre en este rango de fechas para el mismo año";
    }

    if (estado) {
        const semestreActivo = await semestreRepository.findOne({
            where: { estado: true, id: id ? Not(id) : undefined }
        });

        if (semestreActivo) {
            return "Ya existe un semestre activo";
        }
    }

    return null;
}

export async function crearSemestreService(nombre, fechaInicio, fechaFin, estado, descripcion) {
    try {
        const semestreRepository = AppDataSource.getRepository(SemestreSchema);

        const errorValidacion = await validarFechasSemestre(fechaInicio, fechaFin, semestreRepository, null, estado);
        if (errorValidacion) {
            return [null, errorValidacion];
        }

        const currentYear = new Date(fechaInicio).getFullYear();
        const semestresExistentes = await semestreRepository.count({
            where: { fechaInicio: Between(`${currentYear}-01-01`, `${currentYear}-12-31`) }
        });

        if (semestresExistentes >= 2) {
            return [null, "Ya existen dos semestres para este año"];
        }

        const nuevoSemestre = semestreRepository.create({ nombre, fechaInicio, fechaFin, estado, descripcion });
        await semestreRepository.save(nuevoSemestre);

        return [nuevoSemestre, null];
    } catch (error) {
        console.error("Error en crearSemestreService:", error);
        return [null, "Error al crear el semestre"];
    }
}

export async function listarSemestresService() {
    try {
        const semestreRepository = AppDataSource.getRepository(SemestreSchema);
        const semestres = await semestreRepository.find();
        return [semestres, semestres.length ? null : "No se encontraron semestres"];
    } catch (error) {
        return [null, "Error al listar semestres"];
    }
}

export async function obtenerSemestrePorIdService(id) {
    try {
        const semestreRepository = AppDataSource.getRepository(SemestreSchema);
        const semestre = await semestreRepository.findOneBy({ id: parseInt(id, 10) });

        if (!semestre) return [null, "Semestre no encontrado"];

        return [semestre, null];
    } catch (error) {
        console.error("Error en obtenerSemestrePorIdService:", error);
        return [null, "Error al obtener el semestre"];
    }
}

export async function actualizarSemestreService(id, nombre, fechaInicio, fechaFin, estado, descripcion) {
    try {
        const semestreRepository = AppDataSource.getRepository(SemestreSchema);
        const semestre = await semestreRepository.findOneBy({ id: parseInt(id, 10) });

        if (!semestre) return [null, "Semestre no encontrado"];

        if (fechaInicio && fechaFin) {
            const errorValidacion = await validarFechasSemestre(fechaInicio, fechaFin, semestreRepository, id, estado);
            if (errorValidacion) {
                return [null, errorValidacion];
            }
        }

        const camposActualizables = { nombre, fechaInicio, fechaFin, estado, descripcion };

        for (const [campo, valor] of Object.entries(camposActualizables)) {
            if (valor !== undefined) {
                semestre[campo] = valor;
            }
        }

        await semestreRepository.save(semestre);

        return [semestre, null];
    } catch (error) {
        console.error("Error detallado en actualizarSemestreService:", error);
        return [null, "Error al actualizar el semestre"];
    }
}

export async function eliminarSemestreService(id) {
    try {
        const semestreRepository = AppDataSource.getRepository(SemestreSchema);

        const semestre = await semestreRepository.findOneBy({ id });

        if (!semestre) {
            return [null, "Semestre no encontrado"];
        }

        await semestreRepository.delete({ id });

        return [true, null];
    } catch (error) {
        console.error("Error al eliminar el semestre:", error);
        return [null, "Error al eliminar el semestre"];
    }
}


