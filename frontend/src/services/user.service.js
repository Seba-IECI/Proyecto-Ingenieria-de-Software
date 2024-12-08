import axios from './root.service.js';
import { formatUserData } from '@helpers/formatData.js';

export async function getUsers() {
    try {
        const { data } = await axios.get('/user/');
        const formattedData = data.data.map(formatUserData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

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
}

export async function getLoggedUser() {
    try {
        const response = await axios.get(`user/me/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT
            },
        });

        console.log("Respuesta completa del backend:", response.data);

        // Verifica si 'data' contiene el objeto usuario esperado
        const user = response.data.data;

        if (!user || !user.rut) {
            throw new Error("El usuario logueado no tiene un RUT asociado.");
        }

        // Guarda el usuario completo en localStorage si es necesario
        localStorage.setItem('loggedUser', JSON.stringify(user));

        return user; // Devuelve el objeto usuario completo
    } catch (error) {
        console.error("Error obteniendo los datos del usuario logueado:", error);
        throw error;
    }
}
