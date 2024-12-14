import { useState } from "react";
import { updateTarea } from "@services/tarea.service";

const useUpTarea = () => {
    const [tarea, setTarea] = useState({});

    const fetchUpTarea = async (data, id) => {
        try {
            console.log('Datos enviados:', data);
            console.log('ID de la tarea:', id);
            const response = await updateTarea(data, id);
            setTarea(response);
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };

    return {
        fetchUpTarea,
        tarea,
    };
};

export default useUpTarea;