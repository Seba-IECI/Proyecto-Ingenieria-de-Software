import { eliminarDocumento } from "@services/documentosPractica.service";

export default function useEliminarDocumento(setDocumentos) {
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "¿Estás seguro de que deseas eliminar este documento?"
        );
        if (!confirmDelete) return;

        try {
            const response = await eliminarDocumento(id);

            if (response.status === "Success") {
                setDocumentos((prevDocumentos) =>
                    prevDocumentos.filter((doc) => doc.id !== id)
                );
            } else {
                console.error("Error al eliminar documento:", response.message);
            }
        } catch (error) {
            console.error("Error al eliminar documento:", error);
        }
    };

    return { handleDelete };
}
