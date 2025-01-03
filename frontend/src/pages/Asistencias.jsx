import { useState } from "react";
import useValidarAlumno from "@hooks/asistencias/useValidarAlumno";
import ObtenerAsistenciaPopup from "@components/ObtenerAsistenciaPopup";
import BuscarEntreFechasPopup from "@components/BuscarEntreFechasPopup";
import MostrarAsistenciaGeneralPopup from "@components/MostrarAsistenciaGeneralPopup";
import RegistrarAsistenciaForm from "@components/RegistrarAsistenciaForm";
import "@styles/asistencias.css";
import "@styles/asistenciasEliminar.css"; 
import "@styles/asistenciasModificar.css"; 
import "@styles/confirm-popup.css";

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
            resetSearchState();
        } else {
            setSection(sectionName);
            resetSearchState();
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
                    {section === "mostrarGeneral" ? "Cerrar" : "Mostrar asistencia general"}
                </button>
                <button onClick={() => toggleSection("registrarAsistencia")}>
                    {section === "registrarAsistencia" ? "Cerrar" : "Registrar asistencia"}
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
                            <button onClick={() => setShowBuscarId(true)}>
                                Buscar por ID de asistencia
                            </button>
                            <button onClick={() => setShowBuscarFechas(true)}>
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
                <BuscarEntreFechasPopup
                    alumnoId={alumnoId}
                    onClose={() => setShowBuscarFechas(false)}
                />
            )}
            {section === "mostrarGeneral" && (
                <MostrarAsistenciaGeneralPopup
                    onClose={() => toggleSection("mostrarGeneral")}
                />
            )}
            {section === "registrarAsistencia" && (
                <RegistrarAsistenciaForm
                    onClose={() => toggleSection("registrarAsistencia")}
                />
            )}
        </div>
    );
};

export default Asistencias;
