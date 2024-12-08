import axios from './root.service.js';

export async function subirDocumento(data) {
    try {
        const response = await axios.post('/documentos/subirDocumento', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("Respuesta completa del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error en subirDocumento:", error.response?.data || error.message);
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export async function eliminarDocumento(id) {
    try {
        const response = await axios.delete(`/documentos/eliminarDocumento/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function modificarDocumento(id, data) {
    try {
        const response = await axios.put(`/documentos/modificarDocumento/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function obtenerTodosDocumentos() {
    try {
        const response = await axios.get('/documentos/obtenerTodos');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function verDocumentos() {
    try {
        const response = await axios.get('/documentos/verDocumentos', {
            headers: { "Cache-Control": "no-cache" },
        });
        return response.data.data || [];
    } catch (error) {
        console.error("Error en verDocumentos:", error.response?.data || error.message);
        throw error.response?.data || { message: "Error desconocido" };
    }
}