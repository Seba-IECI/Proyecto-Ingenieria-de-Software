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
    
    if (!data.rut || !data.codigosBarras || !data.diasPrestamo) {
        throw new Error("Faltan datos requeridos para crear el préstamo.");
    }

    try {
        const response = await axios.post('/prestamos/', data);
        return response.data; 
    } catch (error) {
        if (error.response) {
            
            console.error("Error del servidor:", error.response.data);
            return error.response.data;
        } else {
            
            console.error("Error de red:", error.message);
            throw new Error("No se pudo conectar con el servidor.");
        }
    }
}

export const addAmonestacion = async (identifier) => {
    try {
        console.log("se recibe id de usuario en sercvico de front")
      const response = await axios.post(`amonestaciones/rut`, { identifier });
      return response.data;
    } catch (error) {
      console.error("Error al añadir amonestación:", error);
      throw new Error(error.response?.data?.message || "Error al añadir amonestación");
    }
  };


  export const addComentario = async (id, comentario) => {
    try {
      
      if (!id || comentario === undefined) {
        throw new Error("Los campos 'id' y 'comentario' son obligatorios.");
      }
  
      
      const response = await axios.patch("/prestamos/comentario", {
        id,
        comentario,
      });
  
      return response.data; 
    } catch (error) {
      console.error("Error al agregar comentario:", error.response?.data || error.message);
      throw error; 
    }
  };




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