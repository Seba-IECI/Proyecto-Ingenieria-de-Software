import axios from './root.service.js';


export async function getPrestamos() {
    try {
        const { data } = await axios.get('prestamos/');
        
        return data;
    } catch (error) {
        return error.response.data;
    }
}



export async function cerrarPrestamo(id) {
    try {
      const { data } = await axios.patch(`prestamos/cerrar?id=${id}`);
      return data;
    } catch (error) {
      console.error("Error al cerrar el préstamo:", error.response?.data || error.message);
      throw error;
    }
  }
  
  
export async function createPrestamo(data) {
    // Validar que los datos requeridos estén presentes
    if (!data.rut || !data.codigosBarras || !data.diasPrestamo) {
        throw new Error("Faltan datos requeridos para crear el préstamo.");
    }

    try {
        const response = await axios.post('/prestamos/', data); // Ruta al backend
        return response.data; // Respuesta del backend
    } catch (error) {
        if (error.response) {
            // Errores enviados desde el backend
            console.error("Error del servidor:", error.response.data);
            return error.response.data;
        } else {
            // Errores de red u otros problemas
            console.error("Error de red:", error.message);
            throw new Error("No se pudo conectar con el servidor.");
        }
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