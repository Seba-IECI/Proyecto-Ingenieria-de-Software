import React from "react";
import "@styles/inventario.css";

export default function EditInventarioPopup({
  show,
  setShow,
  data,
  onChange,
  onUpdate,
  onDelete,
}) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h1>Editar Inventario</h1>
        <form>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={data.nombre}
            onChange={onChange}
            placeholder="Nombre del inventario"
          />
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={data.descripcion}
            onChange={onChange}
            placeholder="Descripción del inventario"
          />
          <label>Encargado (RUT):</label>
          <input
            type="text"
            name="encargado" 
            value={data.encargado}
            onChange={onChange}
            placeholder="RUT del encargado"
          />
          <div className="popup-actions">
            <button type="button" onClick={onUpdate}>
              Guardar Cambios
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={onDelete}
            >
              Eliminar Inventario
            </button>
            <button type="button" onClick={() => setShow(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
