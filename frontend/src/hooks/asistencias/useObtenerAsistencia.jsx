import { useState } from "react";
import { obtenerAsistenciaPorId } from "@services/asistencias.service";

const useObtenerAsistencia = () => {
    const [asistencia, setAsistencia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAsistencia = async (id, alumnoId) => {
        setLoading(true);
        setError(null);
        setAsistencia(null);

        try {
            const response = await obtenerAsistenciaPorId(id, alumnoId);
            const data = response;

            if (!data || !data.alumno || typeof data.alumno.id === "undefined") {
                throw new Error(`No se pudo verificar la asistencia con ID ${id}.`);
            }
            if (data.alumno.id !== parseInt(alumnoId, 10)) {
                throw new Error(
                    `La asistencia con ID ${id} no pertenece al alumno validado con ID ${alumnoId}.`
                );
            }

            setAsistencia(data);
        } catch (err) {
            console.error("Error en fetchAsistencia:", err.message);
            setError(err.message || "Error desconocido.");
        } finally {
            setLoading(false);
        }
    };

    return { asistencia, loading, error, fetchAsistencia };
};

export default useObtenerAsistencia;
