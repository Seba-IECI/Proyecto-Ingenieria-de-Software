const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
    const handleContainerClick = () => onCancel();

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="popup-container" onClick={handleContainerClick}>
            <div className="popup-content-small" onClick={handleContentClick}>
                <h3>Confirmación</h3>
                <p>{message}</p>
                <div className="button-container">
                    <button onClick={onConfirm} className="confirm-button">
                        Confirmar
                    </button>
                    <button onClick={onCancel} className="cancel-button">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;
