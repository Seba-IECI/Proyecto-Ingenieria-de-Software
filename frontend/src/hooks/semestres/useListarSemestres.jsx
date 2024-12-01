import { useEffect, useState } from "react";
import { ListarSemestres } from "@services/semestres.service";

export default function useListarSemestres() {
    const [semestresActivos, setSemestresActivos] = useState([]);
    const [semestresInactivos, setSemestresInactivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSemestres = async () => {
        try {
            const data = await ListarSemestres();
            const activos = data.filter(semestre => semestre.estado);
            const inactivos = data.filter(semestre => !semestre.estado);
            setSemestresActivos(activos);
            setSemestresInactivos(inactivos);
        } catch (error) {
            console.error("Error al listar semestres:", error);
            setError(error.message || "No se pudieron cargar los semestres.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemestres();
    }, []);

    return { semestresActivos, semestresInactivos, loading, error, fetchSemestres };
}
