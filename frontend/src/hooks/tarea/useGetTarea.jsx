import { useState, useEffect } from "react";
import { getTareas as fetchTareasService } from "@services/tarea.service";

const useGetTarea = () => {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTareas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchTareasService();
            setTareas(response.data || []);
        } catch (error) {
            setError(error.message || "Error al cargar las tareas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTareas();
    }, []);

    return {
        tareas,
        loading,
        error,
        refetch: fetchTareas, 
    };
};

export default useGetTarea;
