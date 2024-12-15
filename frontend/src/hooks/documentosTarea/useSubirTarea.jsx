import { useState, useEffect } from "react";
import { subirTarea } from "@services/documentosTarea.service";

export default function useSubirTarea(fetchDocumentos) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setError(null); 
    };

    const handleCreate = async (formData) => {
        setLoading(true);
        setError(null); 

        let isCancelled = false; 

        try {
            const response = await subirTarea(formData);
            console.log("Respuesta recibida en el hook:", response);

            if (!isCancelled) {
                await fetchDocumentos();
                handleClosePopup(); 
            }
        } catch (error) {
            console.error("Error al subir documento:", error);
            if (!isCancelled) {
                setError("Hubo un error al subir la tarea. Inténtalo nuevamente."); 
            }
        } finally {
            if (!isCancelled) {
                setLoading(false); 
            }
        }

        
        return () => {
            isCancelled = true;
        };
    };

    return {
        isPopupOpen,
        handleClickCreate,
        handleClosePopup,
        handleCreate,
        loading,
        error, 
    };
}
