import { useState } from 'react';
import { deshabilitarPeriodoPractica } from '@services/periodosPractica.service';

const useDeshabilitarPeriodoPractica = (refetchPeriodos) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas deshabilitar este periodo de práctica?");
        if (!confirmDelete) return;

        setIsLoading(true);
        setError(null);
        try {
            await deshabilitarPeriodoPractica(id);
            refetchPeriodos(); // Refresca la lista de periodos
        } catch (err) {
            console.error("Error al deshabilitar periodo de práctica:", err);
            setError(err.message || "Error desconocido al deshabilitar el periodo.");
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

export default useDeshabilitarPeriodoPractica;