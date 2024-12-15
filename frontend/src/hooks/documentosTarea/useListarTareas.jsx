import { useState } from "react";
import { listarTareas } from "@services/documentosTarea.service";

export default function useListarTareas() {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTareas = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await listarTareas();

            // Verificar si la respuesta tiene la estructura esperada
            if (!response || !response.data || !Array.isArray(response.data)) {
                console.error("La respuesta de la API no contiene un array válido", response);
                setError("La respuesta de la API no es válida");
                setTareas([]);
                return;
            }

            // Filtrar las tareas válidas dentro de 'data'
            const tareasFiltradas = response.data.filter(
                (tarea) => tarea.id && tarea.nombre && tarea.archivo
            );

            setTareas(tareasFiltradas);
        } catch (err) {
            setError(err.message || "Error al cargar las tareas");
        } finally {
            setLoading(false);
        }
    };

    return { tareas, loading, error, fetchTareas };
}
