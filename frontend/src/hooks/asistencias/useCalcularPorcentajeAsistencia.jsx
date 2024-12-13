import { useState, useCallback } from "react";
import { calcularPorcentajeAsistencia } from "@services/asistencias.service";

const useCalcularPorcentajeAsistencia = () => {
    const [porcentaje, setPorcentaje] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calcular = useCallback(async ({ profesorId, startDate, endDate }) => {
        setLoading(true);
        setError(null);

        try {
            const resultado = await calcularPorcentajeAsistencia({ profesorId, startDate, endDate });
            console.log("Resultado recibido del backend:", resultado); // Depuración
            setPorcentaje(resultado);
        } catch (err) {
            console.error("Error al calcular el porcentaje:", err); // Depuración
            setError(err.message || "Error al calcular el porcentaje de asistencia.");
        } finally {
            setLoading(false);
        }
    }, []);

    const resetState = useCallback(() => {
        setPorcentaje(null);
        setError(null);
    }, []);

    return { porcentaje, loading, error, calcular, resetState };
};

export default useCalcularPorcentajeAsistencia;