const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
    const handleContainerClick = () => onCancel();

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="confirm-cont" onClick={handleContainerClick}>
            <div className="confirm-conte" onClick={handleContentClick}>
                <h3>Confirmación</h3>
                <p>{message}</p>
                <div className="confirm-boton-containe">
                    <button onClick={onConfirm} className="confirm-boton">
                        Confirmar
                    </button>
                    <button onClick={onCancel} className="cancel-boton">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;
