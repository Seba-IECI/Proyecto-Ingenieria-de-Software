import { useState } from "react";
import useListarSemestres from "@hooks/semestres/useListarSemestres";
import "@styles/semestres.css";

export default function Semestres() {
    const { semestresActivos, semestresInactivos, loading, error, fetchSemestres } = useListarSemestres();
    const [isViewing, setIsViewing] = useState(false);

    const handleListarSemestres = async () => {
        if (isViewing) {
            setIsViewing(false);
            return;
        }

        await fetchSemestres();
        setIsViewing(true);
    };

    return (
        <div className="semestres-container">
            <h1 className="semestres-title">Gestión de Semestres</h1>
            <div className="semestres-actions">
                <button onClick={handleListarSemestres} className="semestres-button">
                    {isViewing ? "Ocultar Semestres" : "Ver Semestres"}
                </button>
            </div>
            {loading && <p className="semestres-loading">Cargando semestres...</p>}
            {error && <p className="semestres-error">Error: {error}</p>}
            {isViewing && (
                <>
                    <h2 className="semestres-subtitle">Semestre Activo</h2>
                    {semestresActivos.length > 0 ? (
                        <ul className="semestres-list">
                            {semestresActivos.map((semestre) => (
                                <li key={semestre.id} className="semestre-item">
                                    <p><strong>ID:</strong> {semestre.id}</p>
                                    <p><strong>Nombre:</strong> {semestre.nombre}</p>
                                    <p><strong>Inicio:</strong> {semestre.fechaInicio}</p>
                                    <p><strong>Fin:</strong> {semestre.fechaFin}</p>
                                    <p><strong>Descripción:</strong> {semestre.descripcion}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="semestres-empty">No hay semestres activos.</p>
                    )}
                    <h2 className="semestres-subtitle">Semestres Inactivos</h2>
                    {semestresInactivos.length > 0 ? (
                        <ul className="semestres-list">
                            {semestresInactivos.map((semestre) => (
                                <li key={semestre.id} className="semestre-item">
                                    <p><strong>ID:</strong> {semestre.id}</p>
                                    <p><strong>Nombre:</strong> {semestre.nombre}</p>
                                    <p><strong>Inicio:</strong> {semestre.fechaInicio}</p>
                                    <p><strong>Fin:</strong> {semestre.fechaFin}</p>
                                    <p><strong>Descripción:</strong> {semestre.descripcion}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="semestres-empty">No hay semestres inactivos.</p>
                    )}
                </>
            )}
        </div>
    );
}
