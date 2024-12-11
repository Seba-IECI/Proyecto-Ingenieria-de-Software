import { useState, useEffect } from "react";
import useModificarAsistencia from "@hooks/asistencias/useModificarAsistencia";
import ConfirmPopup from "@components/ConfirmPopup";
import "@styles/asistenciasModificar.css";
import "@styles/confirm-popup.css";

const ModificarAsistenciaPopup = ({ asistenciaId, presenteActual, onClose, onSuccess }) => {
    const { modificar, loading, successMessage, error, resetState } = useModificarAsistencia();
    const [presente, setPresente] = useState(presenteActual);
    const [showConfirm, setShowConfirm] = useState(false);
    const [fadeError, setFadeError] = useState(false);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setFadeError(true);
                setTimeout(() => {
                    setFadeError(false);
                    resetState();
                }, 500);
            }, 3000);
        }
    }, [error, resetState]);

    const handleModificar = async () => {
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        const updatedAsistencia = await modificar(asistenciaId, presente);
        if (!loading && !error && updatedAsistencia) {
            onSuccess(updatedAsistencia);
            setShowConfirm(false);
            onClose();
        } else if (!updatedAsistencia) {
            setShowConfirm(false);
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    const handleContainerClick = () => {
        resetState();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="asistencia-modificar-container" onClick={handleContainerClick}>
            <div className="asistencia-modificar-content" onClick={handleContentClick}>
                <h3 className="asistencia-modificar-title">Modificar Asistencia</h3>
                <p>ID de Asistencia: {asistenciaId}</p>
                <label className="asistencia-modificar-label">
                    Estado:
                    <select
                        className="asistencia-modificar-select"
                        value={presente}
                        onChange={(e) => setPresente(e.target.value === "true")}
                    >
                        <option value="true">Presente</option>
                        <option value="false">Ausente</option>
                    </select>
                </label>
                <div className="button-container">
                    <button
                        onClick={handleModificar}
                        className="asistencia-modificar-button"
                        disabled={loading}
                    >
                        {loading ? "Modificando..." : "Confirmar"}
                    </button>
                    <button onClick={onClose} className="asistencia-cancel-button">
                        Cancelar
                    </button>
                </div>
                {error && (
                    <p
                        className={`asistencia-modificar-error-message ${fadeError ? "fade-out" : ""}`}
                    >
                        {error}
                    </p>
                )}
                {successMessage && <p className="asistencia-modificar-success-message">{successMessage}</p>}
            </div>
            {showConfirm && (
                <ConfirmPopup
                    message="¿Estás seguro de que deseas modificar esta asistencia?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default ModificarAsistenciaPopup;
