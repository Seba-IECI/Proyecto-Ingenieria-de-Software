import { useState, useEffect, useCallback } from "react";
import { getMaterias } from "@services/materia.service";

const useGetMateria = () => {
    const [materias, setMaterias] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMaterias = useCallback(async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await getMaterias();
            setMaterias(response.data || []); 
        } catch (error) {
            setError(error.message || "Error al cargar las materias");
        } finally {
            setLoading(false); 
        }
    }, []);

    useEffect(() => {
        fetchMaterias();
    }, [fetchMaterias]);

    return {
        fetchGetMaterias: fetchMaterias, 
        materias,
        loading,
        error,
    };
};

export default useGetMateria;
