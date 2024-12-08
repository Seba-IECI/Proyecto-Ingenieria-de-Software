import { useState } from "react";
import { addItem, getInventarioCompleto } from "@services/inventario.service";

export const useAddItemPopup = (inventarios, onItemAdded) => {
  const [showPopup, setShowPopup] = useState(false);
  const [inventarioId, setInventarioId] = useState(null);
  const [isNewItem, setIsNewItem] = useState(true);
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [itemData, setItemData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    cBarras: "",
  });

  const openPopup = async (id) => {
    try {
      const inventarioCompleto = await getInventarioCompleto(id);
      if (!inventarioCompleto || !inventarioCompleto.items) {
        console.error("Ítems no disponibles en el inventario");
        return;
      }
      setSelectedInventario(inventarioCompleto);
      setInventarioId(id);
      setShowPopup(true);
    } catch (error) {
      console.error("Error al cargar inventario completo:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsNewItem(true);
    setItemData({ nombre: "", descripcion: "", categoria: "", cBarras: "" });
  };

  const handleInputBlur = (field) => (e) => {
    const value = e.target.value;
    setItemData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddItem = async () => {
    if (isNewItem) {
      if (!itemData.nombre || !itemData.descripcion || !itemData.categoria || !itemData.cBarras) {
        alert("Por favor, completa todos los campos obligatorios para un nuevo ítem.");
        return;
      }
    } else {
      if (!itemData.cBarras) {
        alert("Por favor, ingresa el código de barra para el ítem seleccionado.");
        return;
      }
    }

  
    try {
      const newItem = {
        ...itemData,
        inventario: selectedInventario.nombre,
      };
  
      console.log("Datos a enviar al backend:", newItem);
  
      const response = await addItem(newItem);
  
      if (response?.error) {
       
        alert(`Error al añadir ítem: ${response.error}`);
      } else if (response?.message) {
        
        alert(`Éxito: ${response.message}`);
      } else {
        
        alert("Ocurrió un error desconocido.");
      }
  
      if (onItemAdded) {
        await onItemAdded();
      }
  
      closePopup();
    } catch (error) {
      console.error("Error al añadir ítem:", error);
      alert("Error inesperado al añadir ítem.");
    }
  };
  

  const AddItemPopup = () =>
    showPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Añadir Ítem al Inventario</h2>

          <label>
            Seleccionar Ítem:
            <select
              value={isNewItem ? "nuevo" : itemData.nombre}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "nuevo") {
                  setIsNewItem(true);
                  setItemData({ nombre: "", descripcion: "", categoria: "", cBarras: "" });
                } else {
                  setIsNewItem(false);
                  const selectedItem = selectedInventario?.items?.find((item) => item.nombre === value);

if (selectedItem) {
  console.log("Ítem seleccionado:", selectedItem);
  setItemData({
    nombre: selectedItem.nombre,
    descripcion: selectedItem.descripcion || "",
    categoria: selectedItem.categoria || "Sin Categoría", 
    cBarras: "",
  });
} else {
  console.error("No se encontró el ítem seleccionado.");
}
                }
              }}
            >
              <option value="nuevo">Nuevo Ítem</option>
              {Array.isArray(selectedInventario?.items) &&
                selectedInventario.items.map((item) => (
                  <option key={item.id} value={item.nombre}>
                    {item.nombre}
                  </option>
                ))}
            </select>
          </label>

          {isNewItem && (
            <>
              <label>
                Nombre del Ítem:
                <input
                  type="text"
                  defaultValue={itemData.nombre}
                  onBlur={handleInputBlur("nombre")}
                />
              </label>
              <label>
                Descripción:
                <input
                  type="text"
                  defaultValue={itemData.descripcion}
                  onBlur={handleInputBlur("descripcion")}
                />
              </label>
              <label>
                Categoría:
                <input
                  type="text"
                  defaultValue={itemData.categoria}
                  onBlur={handleInputBlur("categoria")}
                />
              </label>
            </>
          )}

          <label>
            Código de Barra:
            <input
              type="text"
              defaultValue={itemData.cBarras}
              onBlur={handleInputBlur("cBarras")}
            />
          </label>

          <button onClick={handleAddItem}>Añadir Ítem</button>
          <button onClick={closePopup} className="close-button">
            Cancelar
          </button>
        </div>
      </div>
    );

  return {
    AddItemPopup,
    openPopup,
    closePopup,
  };
};
