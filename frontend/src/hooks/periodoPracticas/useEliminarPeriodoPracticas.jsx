import { useState } from 'react';
import { eliminarPeriodoPractica } from '@services/periodosPractica.service';

const useEliminarPeriodoPractica = (refetchPeriodos) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este periodo de práctica?");
        if (!confirmDelete) return;

        setIsLoading(true);
        setError(null);
        try {
            await eliminarPeriodoPractica(id);
            refetchPeriodos(); // Refresca la lista de periodos
        } catch (err) {
            console.error("Error al eliminar periodo de práctica:", err);
            setError(err.message || "Error desconocido al eliminar el periodo.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleDelete,
    };
};

export default useEliminarPeriodoPractica;