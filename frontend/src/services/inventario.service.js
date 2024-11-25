import axios from './root.service.js';


export async function getInventarios() {
    try {
        const { data } = await axios.get('inventario/names/');
        
        return data;
    } catch (error) {
        return error.response.data;
    }
}


export async function getInventarioById(id){ ///uso interno
    try {
        const { data } = await axios.get(`/names/${id}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}


export async function createInventario(data) {
    try {
        const response = await axios.post('/inventario/', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

/*
export async function updateUser(data, rut) {
    try {
        const response = await axios.patch(`/user/detail/?rut=${rut}`, data);
        console.log(response);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteUser(rut) {
    try {
        const response = await axios.delete(`/user/detail/?rut=${rut}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}  */