import { useState } from 'react';
import { createInventario } from '@services/inventario.service';

export default function useCreateInventario(fetchInventarios) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newInventario, setNewInventario] = useState({
    nombre: '',
    descripcion: '',
    encargadoRut: '',
  });

  const handleClickCreate = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setNewInventario({ nombre: '', descripcion: '', encargadoRut: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInventario((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await createInventario(newInventario);
      await fetchInventarios(); // Actualiza la lista de inventarios
      handleClosePopup(); // Cierra el popup al terminar
    } catch (error) {
      console.error('Error al crear inventario:', error);
    }
  };

  return {
    isPopupOpen,
    handleClickCreate,
    handleClosePopup,
    handleChange,
    handleCreate,
    newInventario,
  };
}
