import { useState } from "react";
import { crearSemestre } from "@services/semestres.service";

export default function useCrearSemestre(refetchSemestres) {
    const [formData, setFormData] = useState({
        nombre: "",
        fechaInicio: "",
        fechaFin: "",
        estado: false,
        descripcion: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await crearSemestre(formData);
            refetchSemestres(); // Refrescar la lista de semestres
            setFormData({
                nombre: "",
                fechaInicio: "",
                fechaFin: "",
                estado: false,
                descripcion: "",
            });
        } catch (err) {
            console.error("Error al crear semestre:", err);
            setError(err.message || "Error desconocido al crear el semestre.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        error,
        handleChange,
        handleSubmit,
    };
}
