import { useState } from "react";
import { listarAsistencias } from "@services/asistencias.service";

const useListarAsistencias = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchAsistencias = async ({ semestreId, alumnoId, startDate, endDate }) => {
        setLoading(true);
        setError(null);
        setAsistencias([]);
        try {
            const response = await listarAsistencias({ semestreId, alumnoId, startDate, endDate });
            setAsistencias(response);
        } catch (err) {
            setError(err.message || "Error desconocido al listar asistencias.");
        } finally {
            setLoading(false);
        }
    };

    return { asistencias, loading, error, fetchAsistencias };
};

export default useListarAsistencias;
