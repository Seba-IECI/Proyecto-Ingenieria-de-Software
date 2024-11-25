"use strict";
import { AppDataSource } from "../config/configDb.js"; 
import PeriodoPracticaSchema from "../entity/periodoPractica.entity.js"; 
export async function habilitarPeriodoPractica(fechaInicio, fechaFin, user) {
    const periodoRepository = AppDataSource.getRepository(PeriodoPracticaSchema);
    if (user.rol !== "encargadoPracticas") {
        return [null, "No tiene permiso para habilitar el periodo de práctica"];
    }
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
        return [null, "La fecha de inicio debe ser anterior a la fecha de fin"];
    }
    const nuevoPeriodo = periodoRepository.create({
        fechaInicio,
        fechaFin,
        habilitado: true,
    });
    await periodoRepository.save(nuevoPeriodo);
    return [nuevoPeriodo, null];
}
export async function deshabilitarPeriodoPractica(id, user, deshabilitar = false) {
    const periodoRepository = AppDataSource.getRepository(PeriodoPracticaSchema);
    const periodo = await periodoRepository.findOneBy({ id });
    if (user.rol !== "encargadoPracticas") {
        return [null, "No tiene permiso para deshabilitar el periodo de práctica"];
    }
    if (!periodo) {
        return [null, "Periodo de práctica no encontrado"];
    }
    const fechaActual = new Date();
    if (deshabilitar || fechaActual > periodo.fechaFin) {
        periodo.habilitado = false;
        await periodoRepository.save(periodo);
        return [periodo, null];
    } else {
        return [null, "No se puede deshabilitar el periodo, la fecha de fin no ha sido alcanzada"];
    }
}