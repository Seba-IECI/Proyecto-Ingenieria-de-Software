import { useState } from "react";
import { subirDocumento } from "@services/documentosPractica.service";

export default function useSubirDocumento(fetchDocumentos) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [originalName, setOriginalName] = useState(""); // Estado para el nombre original

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setOriginalName(""); // Resetea el nombre original al cerrar el popup
    };

    const handleCreate = async (formData) => {
        try {
            const response = await subirDocumento(formData); // Llama al servicio
            console.log("Respuesta recibida en el hook:", response); // Depuración
            if (response.data && response.data.originalname) {
                setOriginalName(response.data.originalname); // Guarda el nombre original
            } else {
                console.error("No se recibió el nombre original del backend");
            }
            await fetchDocumentos(); // Refresca la lista de documentos
            handleClosePopup(); // Cierra el popup
        } catch (error) {
            console.error("Error al subir documento:", error);
        }
    };

    return {
        isPopupOpen,
        originalName, // Expone el nombre original para usarlo en el componente
        handleClickCreate,
        handleClosePopup,
        handleCreate,
    };
}
