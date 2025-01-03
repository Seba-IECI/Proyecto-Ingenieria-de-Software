"use strict";

import {
    actualizarAsistenciaService,
    calcularPorcentajeAsistenciaService,
    eliminarAsistenciaService,
    listarAsistenciasService,
    obtenerAsistenciaPorIdService,
    registrarAsistenciaService,
    validarAlumnoPorProfesorService
} from "../services/asistencia.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function eliminarAsistencia(req, res) {
    try {
        const { rol, id: profesorId } = req.user;
        console.log(`Usuario autenticado: ${rol}, ID Profesor: ${profesorId}`); 
        const { id } = req.params;
        if (rol !== "profesor") {
            return handleErrorClient(res, 403, "Solo los profesores pueden eliminar asistencias.");
        }
        if (!id || isNaN(parseInt(id, 10))) {
            return handleErrorClient(res, 400, "ID de asistencia no válido.");
        }
        const [resultado, error] = await eliminarAsistenciaService(parseInt(id, 10), profesorId);
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Asistencia eliminada correctamente.", resultado);
    } catch (error) {
        handleErrorServer(res, 500, "Error al eliminar asistencia.");
    }
}

export async function registrarAsistencia(req, res) {
    try {
        const { rol } = req.user;
        if (rol !== "profesor") {
            return handleErrorClient(res, 403, "Solo los profesores pueden registrar asistencia.");
        }

        const { alumnoId, semestreId, fecha, presente } = req.body;
        const [nuevaAsistencia, error] = await registrarAsistenciaService(
            req.user, alumnoId, semestreId, fecha, presente);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Asistencia registrada correctamente.", nuevaAsistencia);
    } catch (error) {
        console.error("Error en registrarAsistencia:", error);
        handleErrorServer(res, 500, "Error al registrar asistencia.");
    }
}

export async function listarAsistencias(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "profesor") {
            return handleErrorClient(res, 403, "Acceso denegado");
        }

        const { semestreId, alumnoId, startDate, endDate } = req.query;

        if (!semestreId || isNaN(parseInt(semestreId, 10))) {
            return handleErrorClient(res, 400, "El ID del semestre es obligatorio y debe ser un número válido");
        }

        const [asistencias, error] = await listarAsistenciasService(
            parseInt(semestreId, 10),
            alumnoId ? parseInt(alumnoId, 10) : null,
            startDate,
            endDate,
            user.id
        );

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Asistencias obtenidas correctamente", asistencias);
    } catch (error) {
        console.error("Error en listarAsistencias:", error);
        handleErrorServer(res, 500, "Error al obtener asistencias");
    }
}

export async function obtenerAsistenciaPorId(req, res) {
    try {
        const user = req.user;

        if (user.rol !== "profesor") {
            return handleErrorClient(res, 403, "Acceso denegado");
        }

        const { id } = req.params;
        const { alumnoId } = req.query;

        if (!id || isNaN(parseInt(id, 10))) {
            return handleErrorClient(res, 400, "ID de asistencia no válido");
        }

        if (alumnoId && isNaN(parseInt(alumnoId, 10))) {
            return handleErrorClient(res, 400, "ID de alumno no válido");
        }

        const asistenciaId = parseInt(id, 10);
        const validAlumnoId = alumnoId ? parseInt(alumnoId, 10) : null;

        const [asistencia, error] = await obtenerAsistenciaPorIdService(asistenciaId, user.id, validAlumnoId);

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Asistencia obtenida correctamente", asistencia);
    } catch (error) {
        console.error("Error en obtenerAsistenciaPorId:", error);
        handleErrorServer(res, 500, "Error al obtener la asistencia");
    }
}






export async function validarAlumnoPorProfesor(req, res) {
    try {
        const user = req.user;
        if (user.rol !== "profesor") {
            return handleErrorClient(res, 403, "Acceso denegado");
        }

        const { id } = req.params;
        if (!id || isNaN(parseInt(id, 10))) {
            return handleErrorClient(res, 400, "ID de alumno no válido");
        }

        const [alumnoValido, error] = await validarAlumnoPorProfesorService(
            parseInt(id, 10), 
        );

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Alumno válido", alumnoValido);
    } catch (error) {
        console.error("Error en validarAlumnoPorProfesor:", error);
        handleErrorServer(res, 500, "Error al validar alumno");
    }
}

export async function calcularPorcentajeAsistencia(req, res) {
    try {
        const { id: alumnoId, rol } = req.user;
        const { profesorId, startDate, endDate } = req.query;

        if (rol !== "usuario") {
            return handleErrorClient(res, 403,
                "Acceso denegado. Solo los estudiantes pueden calcular su porcentaje de asistencia.");
        }

        if (!profesorId || !startDate || !endDate) {
            return handleErrorClient(res, 400,
                "Todos los parámetros (profesorId, startDate, endDate) son obligatorios.");
        }

        const [resultado, error] = await calcularPorcentajeAsistenciaService(
            parseInt(profesorId, 10),
            startDate,
            endDate,
            alumnoId
        );

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Porcentaje de asistencia calculado correctamente.", resultado);
    } catch (error) {
        console.error("Error en calcularPorcentajeAsistencia:", error);
        handleErrorServer(res, 500, "Error al calcular el porcentaje de asistencia.");
    }
}

export async function actualizarAsistencia(req, res) {
    try {
        const { id } = req.params;
        const { presente, fecha } = req.body;

        if (!id || isNaN(id)) {
            return handleErrorClient(res, 400, "ID de asistencia no válido");
        }

        const asistenciaId = parseInt(id, 10);
        const [asistenciaActualizada, error] = await actualizarAsistenciaService(asistenciaId, presente, fecha);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Asistencia actualizada correctamente", asistenciaActualizada);
    } catch (error) {
        console.error("Error en actualizarAsistencia:", error);
        handleErrorServer(res, 500, "Error al actualizar la asistencia");
    }
}
