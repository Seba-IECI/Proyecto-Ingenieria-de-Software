import axios from './root.service.js';

export async function listarAsistencias({ semestreId, alumnoId, startDate, endDate }) {
    const profesorId = JSON.parse(sessionStorage.getItem('usuario'))?.id;
    try {
        const response = await axios.get('/asistencia/listar', {
            params: { semestreId, alumnoId, startDate, endDate, profesorId },
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (response.data.status === "Success") {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error al listar asistencias.");
        }
    } catch (error) {
        console.error("Error en listarAsistencias:", error);
        throw new Error(error.response?.data?.message || "Error desconocido al listar asistencias.");
    }
}

export async function eliminarAsistencia(id) {
    if (!id) {
        throw new Error("El ID de asistencia es obligatorio para eliminar.");
    }

    try {
        const response = await axios.delete(`/asistencia/eliminar/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (response.data.status === "Success") {
            return response.data.message || "Asistencia eliminada correctamente.";
        } else {
            throw new Error(response.data.message || "Error al eliminar asistencia.");
        }
    } catch (error) {
        console.error("Error completo en eliminarAsistencia:", error);
        throw new Error(error.response?.data?.message || "Error desconocido al eliminar asistencia.");
    }
}


export async function obtenerAsistenciaPorId(id, alumnoId = null) {
    if (!id) {
        throw new Error("El ID de asistencia es obligatorio.");
    }

    try {
        const response = await axios.get(`/asistencia/obtenerAsistenciaPorId/${id}`, {
            params: alumnoId ? { alumnoId } : {},
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                "Cache-Control": "no-cache",
            },
        });

        if (response.data.status === "Success") {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error al obtener asistencia.");
        }
    } catch (error) {
        console.error("Error en obtenerAsistenciaPorId:", error);
        throw new Error(error.response?.data?.message || "Error desconocido al obtener asistencia.");
    }
}


export async function validarAlumnoPorProfesor(id) {
    if (!id) {
        throw new Error("El ID de alumno es obligatorio para validar.");
    }

    try {
        const response = await axios.get(`/asistencia/validarAlumnoPorProfesor/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (response.data.status === "Success") {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error al validar alumno.");
        }
    } catch (error) {
        console.error("Error en validarAlumnoPorProfesor:", error);
        throw new Error(error.response?.data?.message || "Error desconocido al validar alumno.");
    }
}

export async function registrarAsistencia({ alumnoId, semestreId, fecha, presente }) {
    try {
        const response = await axios.post(
            "/asistencia/registrar",
            { alumnoId, semestreId, fecha, presente },
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        );

        if (response.data.status === "Success") {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error al registrar asistencia.");
        }
    } catch (error) {
        console.error("Error en registrarAsistencia:", error);
        throw new Error(error.response?.data?.message || "Error desconocido al registrar asistencia.");
    }
}