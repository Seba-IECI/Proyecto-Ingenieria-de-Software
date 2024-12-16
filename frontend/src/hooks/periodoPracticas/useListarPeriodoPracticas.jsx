import { useState, useEffect } from 'react';
import { listarPeriodosPractica } from '@services/periodosPractica.service';

const useListarPeriodosPractica = () => {
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPeriodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listarPeriodosPractica();
            setPeriodos(data);
        } catch (err) {
            setError(err.message || "Error al cargar los periodos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriodos();
    }, []);

    return { periodos, loading, error, fetchPeriodos };
};

export default useListarPeriodosPractica;