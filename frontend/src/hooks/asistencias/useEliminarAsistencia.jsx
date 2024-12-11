import { useState } from "react";
import { eliminarAsistencia } from "@services/asistencias.service";

const useEliminarAsistencia = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const eliminar = async (id) => {
        setLoading(true);
        setError(null);
        setSuccessMessage("");

        try {
            const message = await eliminarAsistencia(id); // Usa el service directamente
            setSuccessMessage(message); // Mensaje de éxito
        } catch (err) {
            console.error("Error en eliminarAsistencia:", err.message);
            setError(err.message || "Error desconocido al eliminar asistencia.");
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setLoading(false);
        setError(null);
        setSuccessMessage("");
    };

    return { eliminar, loading, error, successMessage, resetState };
};

export default useEliminarAsistencia;
