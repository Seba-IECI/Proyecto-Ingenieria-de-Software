import { useState } from "react";
import { modificarDocumento } from "@services/documentosPractica.service";

export default function useModificarDocumento(fetchDocumentos, userRole) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedDocumento, setSelectedDocumento] = useState(null);
    const [error, setError] = useState(null);

    const handleClickEdit = (documento) => {
        setSelectedDocumento(documento);
        setIsPopupOpen(true);
        setError(null);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedDocumento(null);
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "archivo") {
            setSelectedDocumento((prev) => ({ ...prev, archivo: e.target.files[0] }));
        } else {
            setSelectedDocumento((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = async () => {
        if (!selectedDocumento.archivo) {
            setError("Debes seleccionar un archivo antes de guardar.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nombre", selectedDocumento.nombre);
            if (userRole === "encargadoPracticas") {
                formData.append("especialidad", selectedDocumento.especialidad);
            }
            formData.append("archivo", selectedDocumento.archivo);

            console.log("Enviando al backend:", selectedDocumento.id, formData);

            const response = await modificarDocumento(selectedDocumento.id, formData);

            if (response.status === "Success") {
                const updatedDocumento = response.data;

                fetchDocumentos((prevDocumentos) =>
                    prevDocumentos.map((doc) =>
                        doc.id === updatedDocumento.id
                            ? {
                                ...doc,
                                nombre: updatedDocumento.nombre,
                                especialidad: updatedDocumento.especialidad,
                                url: updatedDocumento.documento,
                                fechaSubida: new Date(updatedDocumento.updatedAt).toLocaleDateString("es-CL"),
                                horaSubida: new Date(updatedDocumento.updatedAt).toLocaleTimeString("es-CL"),
                            }
                            : doc
                    )
                );

                handleClosePopup();
            } else {
                setError(response.message || "Error desconocido al modificar el documento.");
            }
        } catch (error) {
            console.error("Error al modificar documento:", error);
            setError(error.message || "Error desconocido al modificar el documento.");
        }
    };

    return {
        isPopupOpen,
        handleClickEdit,
        handleClosePopup,
        handleChange,
        handleUpdate,
        selectedDocumento,
        error,
    };
}
