import axios from './root.service.js'; 

export async function habilitarPeriodoPractica(fechaInicio, fechaFin) {
    try {
        const response = await axios.post('/periodoPracticas/habilitar', {
            fechaInicio,
            fechaFin,
        });
        return response.data; 
    } catch (error) {
        console.error("Error al habilitar periodo de práctica:", error);
        throw error.response.data; 
    }
}

export async function deshabilitarPeriodoPractica(id) {
    try {
        const response = await axios.patch(`/periodoPracticas/deshabilitar/${id}`);
        return response.data; 
    } catch (error) {
        console.error("Error al deshabilitar periodo de práctica:", error);
        throw error.response.data; 
    }
}

export async function listarPeriodosPractica() {
    try {
        const response = await axios.get('/periodoPracticas/listar'); 
        return response.data; 
    } catch (error) {
        console.error("Error al listar periodos de práctica:", error);
        throw error.response.data; 
    }
}

export async function eliminarPeriodoPractica(id) {
    try {
        const response = await axios.delete(`/periodoPracticas/eliminar/${id}`); 
        return response.data; 
    } catch (error) {
        console.error("Error al eliminar periodo de práctica:", error);
        throw error.response.data; 
    }
}