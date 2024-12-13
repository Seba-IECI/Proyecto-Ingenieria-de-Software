import PropTypes from "prop-types";
import { useState } from "react";
import "@styles/semestres.css";

export default function UpdateSemestrePopup({
    show,
    onClose,
    onUpdate,
    semestreData,
    isLoading,
    error,
    handleChange,
    existeOtroActivo,
}) {
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    if (!show) return null;

    const handleCheckboxClick = (e) => {
        if (e.target.checked && existeOtroActivo && !semestreData.estado) {
            e.preventDefault();
            setMostrarMensaje(true);
            setTimeout(() => setMostrarMensaje(false), 3000);
        } else {
            handleChange(e);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>Actualizar Semestre</h2>
                    <button
                        className="popup-close-button"
                        onClick={() => {
                            if (!isLoading) {
                                onClose();
                            }
                        }}
                    >
                        &times;
                    </button>
                </div>
                <form
                    className="semestres-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onUpdate();
                    }}
                >
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={semestreData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Fecha de Inicio:
                        <input
                            type="date"
                            name="fechaInicio"
                            value={semestreData.fechaInicio}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Fecha de Fin:
                        <input
                            type="date"
                            name="fechaFin"
                            value={semestreData.fechaFin}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="checkbox-container">
                        Activo:
                        <input
                            type="checkbox"
                            name="estado"
                            checked={semestreData.estado}
                            onChange={handleCheckboxClick}
                        />
                        {mostrarMensaje && (
                            <span className="tooltip">
                                Ya existe un semestre activo
                            </span>
                        )}
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            name="descripcion"
                            value={semestreData.descripcion}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" className="semestres-button" disabled={isLoading}>
                        {isLoading ? "Actualizando..." : "Actualizar Semestre"}
                    </button>
                    {error && (
                        <p className="semestres-error">{error}</p>
                    )}
                </form>
            </div>
        </div>
    );
}

UpdateSemestrePopup.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    semestreData: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        fechaInicio: PropTypes.string.isRequired,
        fechaFin: PropTypes.string.isRequired,
        estado: PropTypes.bool.isRequired,
        descripcion: PropTypes.string,
    }).isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    existeOtroActivo: PropTypes.bool.isRequired,
};
