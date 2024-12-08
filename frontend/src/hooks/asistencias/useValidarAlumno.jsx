import { useState } from "react";
import { validarAlumnoPorProfesor } from "@services/asistencias.service";

const useValidarAlumno = () => {
    const [isAlumnoValido, setIsAlumnoValido] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validarAlumno = async (id) => {
        setLoading(true);
        setError(null);
        setIsAlumnoValido(false);

        try {
            const isValid = await validarAlumnoPorProfesor(id);
            setIsAlumnoValido(isValid);
        } catch (err) {
            setError(err.message || "Error desconocido.");
        } finally {
            setLoading(false);
        }
    };

    const resetValidation = () => {
        setIsAlumnoValido(false);
        setError(null);
        setLoading(false);
    };

    return { isAlumnoValido, loading, error, validarAlumno, resetValidation };
};

export default useValidarAlumno;
