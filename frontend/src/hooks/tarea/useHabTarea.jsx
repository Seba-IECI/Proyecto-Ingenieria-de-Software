import { useState } from "react";
import { habilitarTarea } from "@services/tarea.service";

const useHabTarea = () => {
    const [tarea, setTarea] = useState({});

    const fetchHabTarea = async (id) => {
        try {
            const response = await habilitarTarea(id);
            setTarea(response);
        } catch (error) {
            console.error('Error al habilitar la tarea:', error);
        }
    };

    return {
        fetchHabTarea,
        tarea
    };
};

export default useHabTarea;