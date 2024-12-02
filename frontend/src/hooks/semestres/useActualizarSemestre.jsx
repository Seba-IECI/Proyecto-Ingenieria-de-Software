import { useState } from "react";
import { actualizarSemestre } from "@services/semestres.service";

export default function useActualizarSemestre(fetchSemestres) {
    const [semestreData, setSemestreData] = useState({
        nombre: "",
        fechaInicio: "",
        fechaFin: "",
        estado: false,
        descripcion: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSemestreData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCheckboxChange = (isActiveExisting) => {
        if (isActiveExisting) {
            setIsTooltipVisible(true);
            setTimeout(() => setIsTooltipVisible(false), 3000);
        } else {
            setSemestreData((prevData) => ({
                ...prevData,
                estado: !prevData.estado,
            }));
        }
    };

    const handleUpdate = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            await actualizarSemestre(id, semestreData);
            await fetchSemestres();
        } catch (error) {
            setError(error.message || "Error al actualizar semestre.");
        } finally {
            setIsLoading(false);
        }
    };

    const setInitialData = (data) => {
        setSemestreData({
            nombre: data.nombre || "",
            fechaInicio: data.fechaInicio || "",
            fechaFin: data.fechaFin || "",
            estado: data.estado || false,
            descripcion: data.descripcion || "",
        });
    };

    return {
        semestreData,
        isLoading,
        error,
        handleChange,
        handleUpdate,
        setInitialData,
        handleCheckboxChange,
        isTooltipVisible,
    };
}
