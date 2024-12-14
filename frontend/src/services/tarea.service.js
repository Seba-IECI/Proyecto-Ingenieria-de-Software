import axios from './root.service.js';

export async function createTarea(data) {
    try {
        const response = await axios.post('/tarea/crear', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getTareas( ) {
    try {
        const response = await axios.get('/tarea/mostrar');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
    }
}

export async function updateTarea(data, id) {
    try {
        const response = await axios.patch(`/tarea/actualizar/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteTarea(id) {
    try {
        const response = await axios.delete(`/tarea/eliminar/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deshabilitarTarea(id) {
    try {
        const response = await axios.delete(`/tarea/deshabilitar/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function habilitarTarea(id) {
    try {
        const response = await axios.patch(`/tarea/habilitar/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}