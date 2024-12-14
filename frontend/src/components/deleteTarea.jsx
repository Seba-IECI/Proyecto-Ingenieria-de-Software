import React from "react";


const DeleteConfirmation = ({ onConfirm, onCancel }) => (
  <div className="popup">
    <div className="popup-inner">
      <h3>¿Está seguro de que desea eliminar esta tarea?</h3>
      <button onClick={onConfirm}>Eliminar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  </div>
);

export default DeleteConfirmation;
