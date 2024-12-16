import React from 'react';

const MensajePopup = ({ show, onClose, mensaje }) => {
    if (!show) return null;

    return (
        <div className="popup">
            <h2>Mensaje</h2>
            <p>{mensaje}</p>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default MensajePopup;