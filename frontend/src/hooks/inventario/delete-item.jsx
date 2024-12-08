import { useState, useRef } from "react";
import { deleteItem } from "@services/inventario.service";

export const useDeleteItemPopup = (onItemDeleted) => {
  const [showPopup, setShowPopup] = useState(false);
  const codigoBarraRef = useRef(""); 

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    codigoBarraRef.current = "";
  };

  const handleDeleteItem = async () => {
    const codigoBarra = codigoBarraRef.current; 
    if (!codigoBarra) {
      alert("Por favor, ingresa un código de barras válido.");
      return;
    }

    try {
      console.log("Código de barras enviado al backend:", codigoBarra);

      const response = await deleteItem(codigoBarra);

      if (response?.error) {
        alert(`Error al eliminar ítem: ${response.error}`);
      } else {
        alert("Ítem eliminado correctamente.");
      }

      if (onItemDeleted) {
        await onItemDeleted();
      }

      closePopup();
    } catch (error) {
      console.error("Error al eliminar ítem:", error);
      alert("Error inesperado al eliminar ítem.");
    }
  };

  const DeleteItemPopup = () =>
    showPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Eliminar Ítem</h2>

          <label>
            Código de Barra:
            <input
              type="text"
              defaultValue={codigoBarraRef.current}
              onChange={(e) => (codigoBarraRef.current = e.target.value)} 
              placeholder="Ingresa el código de barra del ítem"
            />
          </label>

          <button onClick={handleDeleteItem} className="delete-button">
            Eliminar Ítem
          </button>
          <button onClick={closePopup} className="close-button">
            Cancelar
          </button>
        </div>
      </div>
    );

  return {
    DeleteItemPopup,
    openPopup,
    closePopup,
  };
};
