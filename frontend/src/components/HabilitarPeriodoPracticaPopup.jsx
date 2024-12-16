import React, { useState } from 'react';

const HabilitarPeriodoPracticaPopup = ({ show, onClose, onSubmit }) => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const handleSubmit = () => {
        onSubmit({ fechaInicio, fechaFin });
        onClose();
    };

    if (!show) return null;

    return (
        <div className="popup">
            <h2>Habilitar Periodo de Práctica</h2>
            <label>
                Fecha de Inicio:
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </label>
            <label>
                Fecha de Fin:
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </label>
            <button onClick={handleSubmit}>Habilitar</button>
            <button onClick={onClose}>Cancelar</button>
        </div>
    );
};

export default HabilitarPeriodoPracticaPopup;