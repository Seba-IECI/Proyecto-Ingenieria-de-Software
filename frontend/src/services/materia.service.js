import axios from './root.service.js';

export async function getMaterias() {
    try {
        const { data } = await axios.get('/materia/mos/:id');
        return data.data;
    } catch (error) {
        return error.response.data;
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
        const response = await axios.patch(`/materia/up/?id=${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteMateria(id) {
    try {
        const response = await axios.delete(`/materia/del/?id=${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}