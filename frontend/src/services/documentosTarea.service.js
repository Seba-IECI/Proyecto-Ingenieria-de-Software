import axios from './root.service.js';

export async function subirTarea(data) {
    try {
        const response = await axios.post('/documentosTarea/subir', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("Respuesta completa del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error en subirDocumento:", error.response?.data || error.message);
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export async function listarTareas (){
    try {
        const response = await axios.get('/documentosTarea/listar');
        return response.data;
    } catch (error) {
        return
    }
}