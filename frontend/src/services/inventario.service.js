import axios from './root.service.js';


export async function getInventarios() {
    try {
        const { data } = await axios.get('inventario/names/');
        
        return data;
    } catch (error) {
        return error.response.data;
    }
}


export async function getInventarioById(rut){ ///uso interno
    try {
        console.log("Hola", rut);
        const { data } = await axios.get(`inventario/${rut}`);
        console.log("Hola, soy el inventario", data);
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

export const updateInventario = async (id, inventario) => {
    try {
      const response = await axios.patch(`inventario/update/${id}`, inventario);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar inventario:", error);
      throw error;
    }
  };

  export const deleteInventario = async (id) => {
    try {
      const response = await axios.delete(`inventario/borrar/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar inventario:", error);
      throw error;
    }
  };

  export async function getInventarioCompleto(id) {
    try {
      const response = await axios.get(`inventario/full/${id}`);
      console.log("Inventario completo:", response.data.data);
      return response.data.data; 
    } catch (error) {
      console.error("Error al obtener inventario completo:", error);
      throw error;
    }
  }

  export async function addItem(data) {
    try {
        const response = await axios.post('inventario/add-item/', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
  }

  export async function deleteItem(cBarras) {
    try {
        const response = await axios.delete(`inventario/item?cBarras=${cBarras}`);
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