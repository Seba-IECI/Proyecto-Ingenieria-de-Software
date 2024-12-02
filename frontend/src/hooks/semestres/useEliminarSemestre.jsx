import { useState } from "react";
import { eliminarSemestre } from "@services/semestres.service";

export default function useEliminarSemestre(refreshSemestres) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            await eliminarSemestre(id);
            refreshSemestres();
        } catch (err) {
            console.error("Error al eliminar semestre:", err);
            setError(err.message || "Error desconocido al eliminar semestre.");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, handleDelete };
}
