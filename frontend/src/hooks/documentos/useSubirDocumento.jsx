import { useState } from "react";
import { subirDocumento } from "@services/documentosPractica.service";

export default function useSubirDocumento(fetchDocumentos) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [originalName, setOriginalName] = useState("");

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setOriginalName("");
    };

    const handleCreate = async (formData) => {
        try {
            const response = await subirDocumento(formData);
            console.log("Respuesta recibida en el hook:", response);
            if (response.data && response.data.originalname) {
                setOriginalName(response.data.originalname);
            } else {
                console.error("No se recibió el nombre original del backend");
            }
            await fetchDocumentos();
            handleClosePopup();
        } catch (error) {
            console.error("Error al subir documento:", error);
        }
    };

    return {
        isPopupOpen,
        originalName, //NOMBRE ORIGINAL DEL COMPONENTE
        handleClickCreate,
        handleClosePopup,
        handleCreate,
    };
}
