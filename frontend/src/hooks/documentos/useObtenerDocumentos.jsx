import { useEffect, useState } from "react";
import { obtenerTodosDocumentos } from "@services/documentosPractica.service";

export default function useObtenerDocumentos() {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocumentos = async () => {
        try {
            const response = await obtenerTodosDocumentos();
            setDocumentos(response);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
            setError("No se pudieron cargar los documentos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, []);

    return { documentos, loading, error, fetchDocumentos };
}
