import React from 'react';

const ConfirmacionEliminarPopup = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="popup">
            <h2>Confirmación de Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este periodo de práctica?</p>
            <button onClick={onConfirm}>Sí, eliminar</button>
            <button onClick={onClose}>Cancelar</button>
        </div>
    );
};

export default ConfirmacionEliminarPopup;