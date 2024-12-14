import { useState } from "react";
import { deleteTarea } from "@services/tarea.service";

const useDelTarea = () => {
    const [tarea, setTarea] = useState({});

    const fetchDelTarea = async (id) => {
        try {
            const response = await deleteTarea(id);
            setTarea(response);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    return {
        fetchDelTarea,
        tarea
    };
};

export default useDelTarea;