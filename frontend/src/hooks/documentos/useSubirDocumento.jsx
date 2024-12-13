import { useState } from "react";
import { subirDocumento } from "@services/documentosPractica.service";

export default function useSubirDocumento(fetchDocumentos, rol) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleCreate = async (formData) => {
        try {
            if (rol === "usuario") {
                formData.delete("especialidad");
            }

            const response = await subirDocumento(formData);
            console.log("Respuesta recibida en el hook:", response);
            await fetchDocumentos();
            handleClosePopup();
        } catch (error) {
            console.error("Error al subir documento:", error);
        }
    };

    return {
        isPopupOpen,
        handleClickCreate,
        handleClosePopup,
        handleCreate,
    };
}
