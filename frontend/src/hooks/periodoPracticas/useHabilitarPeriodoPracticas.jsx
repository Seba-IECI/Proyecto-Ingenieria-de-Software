import { useState } from 'react';
import { habilitarPeriodoPractica } from '@services/periodosPractica.service';

const useHabilitarPeriodoPractica = (refetchPeriodos) => {
    const [formData, setFormData] = useState({
        fechaInicio: '',
        fechaFin: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await habilitarPeriodoPractica(formData.fechaInicio, formData.fechaFin);
            refetchPeriodos(); // Refresca la lista de periodos
            setFormData({
                fechaInicio: '',
                fechaFin: '',
            });
        } catch (err) {
            console.error("Error al habilitar periodo de práctica:", err);
            setError(err.message || "Error desconocido al habilitar el periodo.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        error,
        handleChange,
        handleSubmit,
    };
};

export default useHabilitarPeriodoPractica;