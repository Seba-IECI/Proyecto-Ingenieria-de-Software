import "@styles/DeleteSemestresPopup.css";

export default function DeleteSemestresPopup({ show, onClose, onConfirm, nombre }) {
    if (!show) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Confirmar Eliminación</h2>
                <p>
                    ¿Estás seguro de que deseas eliminar el semestre{" "}
                    <strong>{nombre}</strong>? Esta acción no se puede deshacer.
                </p>
                <div className="popup-actions">
                    <button className="popup-button confirm" onClick={onConfirm}>
                        Confirmar
                    </button>
                    <button className="popup-button cancel" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
