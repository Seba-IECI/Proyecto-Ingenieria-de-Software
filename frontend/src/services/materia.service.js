import axios from './root.service.js';

export async function getMaterias() {
    try {
        const response = await axios.get('/materia/mos');
        return response.data; 
    } catch (error) {
        console.error('Error al obtener las materias:', error);
        return { error: 'Error interno del servidor' };
    }
}

export async function createMateria(data) {
    try {
        const response = await axios.post('/materia/sub', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateMateria(data, id) {
    try {
        const response = await axios.patch(`/materia/up/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteMateria(id) {
    try {
        const response = await axios.delete(`/materia/del/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}