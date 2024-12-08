import {useState} from 'react';
import {createMateria} from '@services/materia.service';

const useSubirMateria = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataMateria, setDataMateria] = useState([]);

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleCreate = async (newMateriaData) => {
        if (newMateriaData) {
            try {
                await createMateria(newMateriaData);
                setIsPopupOpen(false);
                setDataMateria([]);
            } catch (error) {
                console.error('Error al crear la materia:', error);
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isPopupOpen,
        setIsPopupOpen,
        dataMateria,
        setDataMateria
    };
};

export default useSubirMateria;