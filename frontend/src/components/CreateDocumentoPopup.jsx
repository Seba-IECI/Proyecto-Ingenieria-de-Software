import "@styles/documentosPractica.css";

export default function CreateDocumentoPopup({ show, setShow, onCreate, error }) {
    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onCreate(formData); // Maneja la creación desde el hook
    };

    const handleClose = () => {
        setShow(false); // Cierra el popup
    };

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h1>Subir Documento</h1>
                    {/* Botón de cerrar (X) en la esquina superior derecha */}
                    <button className="popup-close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Especialidad:</label>
                    <input
                        type="text"
                        name="especialidad"
                        required
                        placeholder="Especialidad"
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
