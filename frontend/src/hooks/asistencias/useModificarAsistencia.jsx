import { useState } from "react";
import { modificarAsistencia } from "@services/asistencias.service";

const useModificarAsistencia = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState(null);

    const modificar = async (id, presente) => {
        setLoading(true);
        setSuccessMessage("");
        setError(null);

        try {
            const updatedAsistencia = await modificarAsistencia(id, presente);
            setSuccessMessage("Asistencia modificada correctamente.");
            return updatedAsistencia;
        } catch (err) {
            console.error("Error en modificarAsistencia:", err.message);
            setError(err.message || "Error desconocido al modificar asistencia.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setLoading(false);
        setSuccessMessage("");
        setError(null);
    };

    return { modificar, loading, successMessage, error, resetState };
};

export default useModificarAsistencia;
