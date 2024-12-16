import React from 'react';
import '@styles/popup.css'; 

const ConfirmarDeshabilitarPopup = ({ show, onClose, onConfirm, nombre }) => {
    if (!show) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Deshabilitar Periodo de Práctica</h2>
                <p>¿Estás seguro de que deseas deshabilitar el periodo de práctica: <strong>{nombre}</strong>?</p>
                <div className="popup-actions">
                    <button onClick={onConfirm}>Confirmar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarDeshabilitarPopup;