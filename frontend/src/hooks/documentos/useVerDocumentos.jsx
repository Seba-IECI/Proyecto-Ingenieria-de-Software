import { useEffect, useState } from "react";
import { verDocumentos } from "@services/documentosPractica.service";

export default function useVerDocumentos() {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocumentos = async () => {
        try {
            const data = await verDocumentos();
            const documentosProcesados = data.map(doc => ({
                id: doc.id || "Sin ID",
                especialidad: doc.especialidad || "Sin Especialidad",
                encargadoPracticasId: doc.encargadoPracticasId || "No Aplica",
                alumnoId: doc.alumnoId || "No Aplica",
                fechaSubida: doc.fechaSubida || "No Disponible",
                updatedAt: doc.updatedAt || "No Disponible",
                url: doc.url || "#",
            }));
            setDocumentos(documentosProcesados);
        } catch (error) {
            console.error("Error al ver documentos:", error);
            setError(error.message || "No se pudieron cargar los documentos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, []);

    return { documentos, loading, error, fetchDocumentos };
}
