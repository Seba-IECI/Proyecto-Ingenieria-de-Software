import { useState } from "react";
import useObtenerAsistencia from "@hooks/asistencias/useObtenerAsistencia";

const ObtenerAsistenciaPopup = ({ alumnoId, onClose }) => {
    const [asistenciaId, setAsistenciaId] = useState("");
    const { asistencia, loading, error, fetchAsistencia } = useObtenerAsistencia();

    const handleBuscar = () => {
        if (!asistenciaId.trim()) {
            alert("Por favor ingresa un ID de asistencia válido.");
            return;
        }
        fetchAsistencia(asistenciaId.trim(), alumnoId); 
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
                {error && <p className="error-message">{error}</p>}
                {asistencia && (
                    <div className="asistencia-detalle">
                        <p><strong>Fecha:</strong> {asistencia.fecha}</p>
                        <p><strong>Alumno:</strong> {asistencia.alumno.nombreCompleto || "Desconocido"}</p>
                        <p><strong>Estado:</strong> {asistencia.presente ? "Presente" : "Ausente"}</p>
                        <p><strong>Semestre:</strong> {asistencia.semestre.nombre || "No asignado"}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObtenerAsistenciaPopup;
