import {
    addItemService,
    createInventarioService,
    deleteInventarioService,
    deleteItemService,
    getInventarioByIdService,
    getItemService,
    updateInventarioService,
    
  } from "../services/inventario.service.js";
  
  
  export async function createInventarioController(req, res) {
    try {
      const [nuevoInventario, error] = await createInventarioService(req.body);
  
      if (error) {
        return res.status(400).json({ message: error });
      }
  
      return res.status(201).json(nuevoInventario);
    } catch (error) {
      console.error("Error en el controlador al crear el inventario:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
    
  
  export async function getInventarioByIdController(req, res) {
    try {
      
      const { id, nombre } = req.query;
      
      
      const [inventario, error] = await getInventarioByIdService({ id, nombre });
  
      if (error) {
        return res.status(404).json({ message: error });
      }
  
      return res.status(200).json(inventario);
    } catch (error) {
      console.error("Error en el controlador al obtener el inventario:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  
 
  export async function updateInventarioController(req, res) {
    try {
      const { id } = req.params;
      const [inventarioActualizado, error] = await updateInventarioService(id, req.body);
  
      if (error) {
        return res.status(404).json({ message: error });
      }
  
      return res.status(200).json(inventarioActualizado);
    } catch (error) {
      console.error("Error en el controlador al actualizar el inventario:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  
  export async function deleteInventarioController(req, res) {
    try {
      const { id } = req.params;
      const [inventarioEliminado, error] = await deleteInventarioService(id);
  
      if (error) {
        return res.status(404).json({ message: error });
      }
  
      return res.status(200).json({ message: "Inventario eliminado exitosamente", inventarioEliminado });
    } catch (error) {
      console.error("Error en el controlador al eliminar el inventario:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  export async function addItemController(req, res) {
    try {
      const [nuevoItem, error] = await addItemService(req.body);
  
      if (error) {
        return res.status(400).json({ message: error });
      }
  
      return res.status(201).json(nuevoItem);
    } catch (error) {
      console.error("Error en el controlador al añadir un artículo:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  


export async function getItemController(req, res) {
  try {
    
    const { id, cBarras, nombre } = req.query;

  
    const [itemFound, error] = await getItemService({ id, cBarras, nombre });

    
    if (error) {
      return res.status(404).json({ message: error });
    }

    return res.status(200).json(itemFound);
  } catch (error) {
    console.error("Error en el controlador al obtener el artículo de inventario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}





export async function deleteItemController(req, res) {
  try {
    
    const { id, cBarras } = req.query;

    
    const [updatedItem, error] = await deleteItemService({ id, cBarras });

    
    if (error) {
      return res.status(404).json({ message: error });
    }

    return res.status(200).json({
      message: "Cantidad reducida exitosamente",
      updatedItem,
    });
  } catch (error) {
    console.error("Error en el controlador al reducir la cantidad de un artículo de inventario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}



