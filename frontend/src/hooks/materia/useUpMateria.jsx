import {useState} from 'react';
import {updateMateria} from '@services/materia.service';

const useUpMateria = () => {
    const [materia, setMateria] = useState({})

    const fetchUpMateria = async (data, id) => {
        try {
            const response = await updateMateria(data, id);
            setMateria(response);
        } catch (error) {
            console.error('Error al actualizar la materia:', error);
        }
    }

    return {
        fetchUpMateria,
        materia
    }

};

export default useUpMateria;