import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext'; 
import useListarPeriodosPractica from '@hooks/periodoPracticas/useListarPeriodoPracticas';
import useHabilitarPeriodoPractica from '@hooks/periodoPracticas/useHabilitarPeriodoPracticas';
import useDeshabilitarPeriodoPractica from '@hooks/periodoPracticas/useDeshabilitarPeriodoPracticas';
import HabilitarPeriodoPracticaPopup from '@components/HabilitarPeriodoPracticaPopup';
import DeshabilitarPeriodoPracticaPopup from '@components/DeshabilitarPeriodoPracticaPopup';
import '@styles/periodoPracticas.css';

const PeriodoPracticas = () => {
    const { user } = useAuth(); 
    const userRole = user?.rol;
    
    const { periodos, loading, error, fetchPeriodos } = useListarPeriodosPractica();
    const { handleSubmit: habilitarPeriodo, isLoading: isHabilitando } = useHabilitarPeriodoPractica(fetchPeriodos);
    const { handleDelete: deshabilitarPeriodo, isLoading: isDeshabilitando } = useDeshabilitarPeriodoPractica(fetchPeriodos);

    const [isHabilitarPopupOpen, setHabilitarPopupOpen] = useState(false);
    const [isDeshabilitarPopupOpen, setDeshabilitarPopupOpen] = useState(false);
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
    const [generalError, setGeneralError] = useState('');

    useEffect(() => {
        if (!userRole) {
            setGeneralError('Error: No se pudo determinar el rol del usuario.');
            return;
        }

        fetchPeriodos();
    }, [userRole]);

    const handleHabilitarClick = () => {
        setHabilitarPopupOpen(true);
    };

    const handleDeshabilitarClick = (periodo) => {
        setSelectedPeriodo(periodo);
        setDeshabilitarPopupOpen(true);
    };

    const handleConfirmHabilitar = async (data) => {
        try {
            await habilitarPeriodo(data.fechaInicio, data.fechaFin);
            setGeneralError('');
        } catch (error) {
            setGeneralError(error || 'Error desconocido al habilitar el periodo.');
        } finally {
            setHabilitarPopupOpen(false);
        }
    };

    const handleConfirmDeshabilitar = async () => {
        try {
            await deshabilitarPeriodo(selectedPeriodo.id);
            setGeneralError('');
        } catch (error) {
            setGeneralError(error || 'Error desconocido al deshabilitar el periodo.');
        } finally {
            setDeshabilitarPopupOpen(false);
        }
    };

    if (!userRole) {
        return <p className="error-message">Error: No se pudo determinar el rol del usuario.</p>;
    }

    if (loading) return <p>Cargando periodos de práctica...</p>;
    if (error || generalError) return <p className="error-message">{error || generalError}</p>;

    return (
        <div className="periodo-practicas-container">
            <h1>Gestión de Periodos de Práctica</h1>
            <button onClick={handleHabilitarClick} className="habilitar-button" disabled={isHabilitando}>
                {isHabilitando ? 'Habilitando...' : 'Habilitar Nuevo Periodo'}
            </button>
            <h2>Periodos Actuales</h2>
            <ul className="periodos-list">
                {periodos.map((periodo) => (
                    <li key={periodo.id} className="periodo-item">
                        <p><strong>Fecha de Inicio:</strong> {new Intl.DateTimeFormat('es-CL').format(new Date(periodo.fechaInicio))}</p>
                        <p><strong>Fecha de Fin:</strong> {new Intl.DateTimeFormat('es-CL').format(new Date(periodo.fechaFin))}</p>
                        <p><strong>Estado:</strong> {periodo.habilitado ? 'Habilitado' : 'Deshabilitado'}</p>
                        <button
                            onClick={() => handleDeshabilitarClick(periodo)}
                            className="deshabilitar-button"
                            disabled={isDeshabilitando}
                        >
                            {isDeshabilitando ? 'Deshabilitando...' : 'Deshabilitar'}
                        </button>
                    </li>
                ))}
            </ul>

            <HabilitarPeriodoPracticaPopup
                show={isHabilitarPopupOpen}
                onClose={() => setHabilitarPopupOpen(false)}
                onSubmit={handleConfirmHabilitar}
            />
            <DeshabilitarPeriodoPracticaPopup
                show={isDeshabilitarPopupOpen}
                onClose={() => setDeshabilitarPopupOpen(false)}
                onConfirm={handleConfirmDeshabilitar}
            />
        </div>
    );
};

export default PeriodoPracticas;
