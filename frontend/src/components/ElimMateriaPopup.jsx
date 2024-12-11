
import React from "react";
import PropTypes from "prop-types";
import "@styles/ElimMateriaPopup.css";

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-popup-overlay">
            <div className="confirm-popup">
                <h2>Confirmación</h2>
                <p>{message || "¿Estás seguro de que deseas eliminar esta materia?"}</p>
                <div className="popup-actions">
                    <button className="confirm-button" onClick={onConfirm}>
                        Sí, eliminar
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDeletePopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.string,
};

export default ConfirmDeletePopup;
