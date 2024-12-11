import {useState} from 'react';
import {deleteMateria} from '@services/materia.service';

const useDelMateria = () => {
    const [materia, setMateria] = useState({});

    const fetchDelMateria = async (id) => {
        try {
            const response = await deleteMateria(id);
            setMateria(response);
        } catch (error) {
            console.error('Error al eliminar la materia:', error);
        }
    };

    return {
        fetchDelMateria,
        materia
    };
};

export default useDelMateria;