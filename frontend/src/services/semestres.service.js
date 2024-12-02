import axios from './root.service.js';

export async function ListarSemestres() {
    try {
        const response = await axios.get('/semestres/ListarSemestres', {
            headers: {
                "Cache-Control": "no-cache",
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            },
        });

        if (response.data && response.data.status === "Success" && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Datos inválidos recibidos del servidor.");
        }
    } catch (error) {
        console.error("Error en listarSemestres:", error);
        throw new Error(error.response?.data?.message || "Error al listar semestres.");
    }
}

export async function crearSemestre(semestre) {
    try {
        const response = await axios.post("/semestres/crearSemestre", semestre, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        if (response.data && response.data.status === "Success") {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error al crear el semestre.");
        }
    } catch (error) {
        console.error("Error en crearSemestre:", error);
        throw new Error(error.response?.data?.message || "Error desconocido al crear el semestre.");
    }
}