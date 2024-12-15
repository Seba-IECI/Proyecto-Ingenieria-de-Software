import "@styles/documentosPractica.css";

export default function CreateDocumentoPopup({ show, setShow, onCreate, error }) {
    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onCreate(formData);
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h1>Subir Tarea</h1>
                    <button className="popup-close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Nombre de la Tarea:</label>
                    <input
                        type="text"
                        name="nombre"
                        required
                        placeholder="Ingresa el nombre de la tarea"
                    />

                    <label>Archivo (PDF):</label>
                    <input
                        type="file"
                        name="archivo"
                        accept=".pdf"
                        required
                    />

                    {error && <p className="error-message">{error}</p>}

                    <div className="popup-actions">
                        <button type="submit">Subir Documento</button>
                        <button type="button" onClick={handleClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
