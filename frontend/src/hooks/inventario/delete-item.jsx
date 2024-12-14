import { useState, useRef } from "react";
import { deleteItem } from "@services/inventario.service";
import { validations } from "@helpers/formatData";

const DeleteItemPopup = ({ showPopup, handleDeleteItem, closePopup }) => {
  const inputRef = useRef();
  const [error, setError] = useState(""); 

  if (!showPopup) return null;

  const handleInputChange = () => {
    const value = inputRef.current.value;
    setError(""); 
  };

  const handleSubmit = () => {
    const codigoBarra = inputRef.current.value; 
    const validationError = validations.validateCodigoBarras(codigoBarra);
    if (validationError) {
      setError(validationError); 
    } else {
      handleDeleteItem(codigoBarra); 
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Eliminar Ítem</h2>
        <label>
          Código de Barra:
          <input
            type="text"
            ref={inputRef} 
            onChange={handleInputChange} 
            placeholder="Ingresa el código de barra del ítem"
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleSubmit} className="delete-button">
          Eliminar Ítem
        </button>
        <button onClick={closePopup} className="close-button">
          Cancelar
        </button>
      </div>
    </div>
  );
};


export const useDeleteItemPopup = (onItemDeleted) => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);

  const closePopup = () => setShowPopup(false);

  const handleDeleteItem = async (codigoBarra) => {
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

  return {
    DeleteItemPopup: () => (
      <DeleteItemPopup
        showPopup={showPopup}
        handleDeleteItem={handleDeleteItem}
        closePopup={closePopup}
      />
    ),
    openPopup,
    closePopup,
  };
};
