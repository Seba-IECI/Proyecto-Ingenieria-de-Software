import { useState } from "react";
import useObtenerAsistencia from "@hooks/asistencias/useObtenerAsistencia";
import useEliminarAsistencia from "@hooks/asistencias/useEliminarAsistencia";
import ConfirmPopup from "@components/ConfirmPopup";
import "@styles/asistenciasEliminar.css";

const ObtenerAsistenciaPopup = ({ alumnoId, onClose }) => {
    const [asistenciaId, setAsistenciaId] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { asistencia, loading, error, fetchAsistencia } = useObtenerAsistencia();
    const {
        eliminar,
        loading: deleting,
        error: deleteError,
        successMessage,
        resetState,
    } = useEliminarAsistencia();

    const handleBuscar = () => {
        if (!asistenciaId.trim()) {
            alert("Por favor ingresa un ID de asistencia válido.");
            return;
        }
        fetchAsistencia(asistenciaId.trim(), alumnoId);
        resetState();
    };

    const handleEliminar = async (id) => {
        if (!id) return;
        await eliminar(id);
        setShowConfirm(false);
    };

    const confirmEliminar = (id) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setSelectedId(null);
    };

    const handleContainerClick = () => {
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="popup-container" onClick={handleContainerClick}>
            <div className="popup-content" onClick={handleContentClick}>
                <h2>Buscar Asistencia por ID</h2>
                <input
                    type="text"
                    placeholder="Ingrese ID de asistencia"
                    value={asistenciaId}
                    onChange={(e) => setAsistenciaId(e.target.value)}
                />
                <div className="button-container">
                    <button onClick={handleBuscar} disabled={loading}>
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                    <button onClick={onClose} className="close-button">
                        Cerrar
                    </button>
                </div>
                {loading && <p>Cargando...</p>}
                {error && <p className="asistencia-eliminar-error">{error}</p>}
                {successMessage && <p className="asistencia-eliminar-success">{successMessage}</p>}
                {deleteError && <p className="asistencia-eliminar-error">{deleteError}</p>}
                {asistencia && (
                    <div className="asistencia-detalle">
                        <p>
                            <strong>Fecha:</strong> {asistencia.fecha}
                        </p>
                        <p>
                            <strong>Alumno:</strong> {asistencia.alumno.nombreCompleto || "Desconocido"}
                        </p>
                        <p>
                            <strong>Estado:</strong> {asistencia.presente ? "Presente" : "Ausente"}
                        </p>
                        <p>
                            <strong>Semestre:</strong> {asistencia.semestre.nombre || "No asignado"}
                        </p>
                        <div className="asistencia-actions">
                            <button
                                onClick={() => confirmEliminar(asistencia.id)}
                                disabled={deleting}
                                className="asistencia-eliminar-button"
                            >
                                {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {showConfirm && (
                <ConfirmPopup
                    message="¿Estás seguro de que deseas eliminar esta asistencia?"
                    onConfirm={() => handleEliminar(selectedId)}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default ObtenerAsistenciaPopup;
