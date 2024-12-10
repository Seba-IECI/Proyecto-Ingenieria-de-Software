import { useState } from "react";
import { registrarAsistencia } from "@services/asistencias.service";

const RegistrarAsistenciaForm = ({ onClose }) => {
    const [alumnoId, setAlumnoId] = useState("");
    const [semestreId, setSemestreId] = useState("");
    const [fecha, setFecha] = useState("");
    const [presente, setPresente] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleRegistrarAsistencia = async () => {
        if (!alumnoId || !semestreId || !fecha) {
            setError("Por favor completa todos los campos obligatorios.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage("");

        try {
            await registrarAsistencia({
                alumnoId: parseInt(alumnoId),
                semestreId: parseInt(semestreId),
                fecha,
                presente,
            });
            setSuccessMessage("Asistencia registrada correctamente.");
            setAlumnoId("");
            setSemestreId("");
            setFecha("");
            setPresente(true);
        } catch (err) {
            setError(err.message || "Error desconocido al registrar asistencia.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registrar-asistencia-container">
            <h2>Registrar Asistencia</h2>
            <div className="registrar-asistencia-form">
                <label>
                    ID del Alumno:
                    <input
                        type="text"
                        value={alumnoId}
                        onChange={(e) => setAlumnoId(e.target.value)}
                        placeholder="Ingrese el ID del alumno"
                    />
                </label>
                <label>
                    ID del Semestre:
                    <input
                        type="text"
                        value={semestreId}
                        onChange={(e) => setSemestreId(e.target.value)}
                        placeholder="Ingrese el ID del semestre"
                    />
                </label>
                <label>
                    Fecha:
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </label>
                <label>
                    Estado:
                    <select
                        value={presente}
                        onChange={(e) => setPresente(e.target.value === "true")}
                    >
                        <option value="true">Presente</option>
                        <option value="false">Ausente</option>
                    </select>
                </label>
                <div className="registrar-asistencia-buttons">
                    <button onClick={handleRegistrarAsistencia} disabled={loading}>
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
        </div>
    );
};

export default RegistrarAsistenciaForm;
