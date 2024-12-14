import { useState } from 'react';
import { createTarea } from "@services/tarea.service";

const useCreateTarea = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tarea, setTarea] = useState({}); 

  const handleClickCreate = () => {
    setIsPopupOpen(true);
  };

  const handleCreate = async (newTareaData) => {
    if (newTareaData) {
      try {
        const response = await createTarea(newTareaData);
        console.log('Respuesta de createTarea:', response); 
        setIsPopupOpen(false);
        setTarea({}); 
        return response;
      } catch (error) {
        console.error('Error al crear la tarea:', error);
      }
    }
  };

  return {
    handleClickCreate,
    handleCreate,
    isPopupOpen,
    setIsPopupOpen,
    tarea,
    setTarea
  };
};

export default useCreateTarea;