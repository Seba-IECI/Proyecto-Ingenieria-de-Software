import { useState } from "react";
import useValidarAlumno from "@hooks/asistencias/useValidarAlumno";
import ObtenerAsistenciaPopup from "@components/ObtenerAsistenciaPopup";
import "@styles/asistencias.css";

const Asistencias = () => {
    const [section, setSection] = useState(null);
    const [alumnoId, setAlumnoId] = useState("");
    const [showBuscarId, setShowBuscarId] = useState(false);
    const [showBuscarFechas, setShowBuscarFechas] = useState(false);

    const { isAlumnoValido, loading, error, validarAlumno, resetValidation } = useValidarAlumno();

    const handleBuscarAlumno = () => {
        if (!alumnoId.trim()) {
            alert("Por favor ingresa una ID válida.");
            return;
        }
        validarAlumno(alumnoId.trim());
    };

    const resetSearchState = () => {
        setAlumnoId("");
        resetValidation();
        setShowBuscarId(false);
        setShowBuscarFechas(false);
    };

    const toggleSection = (sectionName) => {
        if (section === sectionName) {
            setSection(null);
            if (sectionName === "buscarAlumno") {
                resetSearchState();
            }
        } else {
            setSection(sectionName);
            if (sectionName === "buscarAlumno") {
                resetSearchState();
            }
        }
    };

    return (
        <div className="asistencias-container">
            <h1>Gestión de Asistencias</h1>
            <div className="asistencias-buttons">
                <button onClick={() => toggleSection("buscarAlumno")}>
                    {section === "buscarAlumno" ? "Cerrar" : "Buscar por alumno"}
                </button>
                <button onClick={() => toggleSection("mostrarGeneral")}>
                    Mostrar asistencia general
                </button>
            </div>

            {section === "buscarAlumno" && (
                <div className="asistencias-section">
                    <h2>Buscar por Alumno</h2>
                    <div className="buscar-alumno">
                        <input
                            type="text"
                            placeholder="Ingrese ID del alumno"
                            value={alumnoId}
                            onChange={(e) => setAlumnoId(e.target.value)}
                        />
                        <button onClick={handleBuscarAlumno} disabled={loading}>
                            {loading ? "Validando..." : "Buscar"}
                        </button>
                    </div>
                    {loading && <p>Cargando...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {isAlumnoValido && (
                        <div className="opciones-busqueda">
                            <button
                                onClick={() => setShowBuscarId(true)}
                            >
                                Buscar por ID de asistencia
                            </button>
                            <button
                                onClick={() => setShowBuscarFechas(true)}
                            >
                                Buscar entre fechas
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showBuscarId && (
                <ObtenerAsistenciaPopup
                    alumnoId={alumnoId}
                    onClose={() => setShowBuscarId(false)}
                />
            )}

            {showBuscarFechas && (
                <div className="buscar-fechas">
                    <p>Componente para buscar entre fechas (en desarrollo).</p>
                    <button onClick={() => setShowBuscarFechas(false)}>Cerrar</button>
                </div>
            )}

            {section === "mostrarGeneral" && (
                <div className="asistencias-section">
                    <h2>Mostrar Asistencia General</h2>
                    <p>Selecciona un rango de fechas o filtros para ver la asistencia general.</p>
                </div>
            )}
        </div>
    );
};

export default Asistencias;
