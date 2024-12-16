"use strict";
 import { habilitarPeriodoPractica, deshabilitarPeriodoPractica, listarPeriodosPractica, eliminarPeriodoPractica } from "../services/periodoPracticas.service.js";

export async function habilitarPeriodo(req, res) {
    const { fechaInicio, fechaFin } = req.body;

    try {
        const [nuevoPeriodo, error] = await habilitarPeriodoPractica(fechaInicio, fechaFin, req.user);
        if (error) {
            return res.status(400).json({ message: error });
        }
        return res.status(201).json(nuevoPeriodo);
    } catch (error) {
        console.error("Error en habilitarPeriodo:", error);
        return res.status(500).json({ message: "Error al habilitar el periodo de práctica" });
    }
}

export async function deshabilitarPeriodo(req, res) {
    const { id } = req.params;
    const { deshabilitar } = req.body;
    try {
        const [periodoDeshabilitado, error] = await deshabilitarPeriodoPractica(id, req.user, deshabilitar);
        if (error) {
            return res.status(400).json({ message: error });
        }
        return res.status(200).json(periodoDeshabilitado);
    } catch (error) {
        console.error("Error en deshabilitarPeriodo:", error);
        return res.status(500).json({ message: "Error al deshabilitar el periodo de práctica" });
    }
}

export async function listarPeriodosController(req, res) {
    try {
        const periodos = await listarPeriodosPractica(req.user);
        return res.status(200).json(periodos);
    } catch (error) {
        console.error("Error al listar periodos de práctica:", error);
        return res.status(500).json({ message: error.message });
    }
}

export async function eliminarPeriodoController(req, res) {
    const { id } = req.params;
    try {
        const periodoEliminado = await eliminarPeriodoPractica(id, req.user);
        return res.status(200).json({ message: "Periodo eliminado exitosamente", periodo: periodoEliminado });
    } catch (error) {
        console.error("Error al eliminar periodo de práctica:", error);
        return res.status(500).json({ message: error.message });
    }
}