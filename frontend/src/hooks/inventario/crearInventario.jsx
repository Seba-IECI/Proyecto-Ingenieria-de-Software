import { useState } from "react";
import { createInventario } from "@services/inventario.service";
import Swal from "sweetalert2";

export default function useCreateInventario(fetchInventarios) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newInventario, setNewInventario] = useState({
    nombre: "",
    descripcion: "",
    encargadoRut: "",
  });

  const handleClickCreate = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setNewInventario({ nombre: "", descripcion: "", encargadoRut: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInventario((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await createInventario(newInventario);
      await fetchInventarios(); 
      handleClosePopup();

      
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Inventario creado con éxito",
      });
    } catch (error) {
      console.error("Error al crear inventario:", error);

      
      const backendMessage =
        error.response?.data?.message || "Error desconocido del servidor";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMessage,
      });
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
