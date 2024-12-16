import React from 'react';

const DetallesPeriodoPracticaPopup = ({ show, onClose, periodo }) => {
    if (!show || !periodo) return null;

    return (
        <div className="popup">
            <h2>Detalles del Periodo de Práctica</h2>
            <p><strong>Fecha de Inicio:</strong> {periodo.fechaInicio}</p>
            <p><strong>Fecha de Fin:</strong> {periodo.fechaFin}</p>
            <p><strong>Estado:</strong> {periodo.habilitado ? 'Habilitado' : 'Deshabilitado'}</p>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default DetallesPeriodoPracticaPopup;