
import { useState } from "react";
import axios from "@services/root.service.js";

const useRegistrarAsistencia = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const registrarAsistencia = async ({ alumnoId, semestreId, fecha, presente }) => {
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const response = await axios.post(
                "/asistencia/registrar",
                { alumnoId, semestreId, fecha, presente },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.status === "Success") {
                setSuccess(true);
                return response.data.data;
            } else {
                throw new Error(response.data.message || "Error al registrar asistencia.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido al registrar asistencia.");
            console.error("Error en registrarAsistencia:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        success,
        error,
        registrarAsistencia,
    };
};

export default useRegistrarAsistencia;
