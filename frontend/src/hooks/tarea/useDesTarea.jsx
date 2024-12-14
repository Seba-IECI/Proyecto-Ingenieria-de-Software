import  {useState} from 'react';
import { deshabilitarTarea } from '@services/tarea.service';

const useDesTarea = () => {
    const [tarea, setTarea] = useState({});

    const fetchDesTarea = async (id) => {
        try {
            const response = await deshabilitarTarea(id);
            setTarea(response);
        } catch (error) {
            console.error('Error al deshabilitar la tarea:', error);
        }
    };

    return {
        fetchDesTarea,
        tarea
    };
};

export default useDesTarea;