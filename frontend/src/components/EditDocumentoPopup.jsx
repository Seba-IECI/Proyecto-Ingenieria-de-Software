import "@styles/documentosPractica.css";

export default function EditDocumentoPopup({ show, setShow, data, onUpdate, onChange, error }) {
    if (!show || !data) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate();
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h1>Editar Documento</h1>
                    <button className="popup-close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Especialidad:</label>
                    <input
                        type="text"
                        name="especialidad"
                        value={data.especialidad}
                        required
                        onChange={onChange}
                        placeholder="Especialidad"
                    />
                    <label>Archivo (PDF):</label>
                    <input
                        type="file"
                        name="archivo"
                        accept=".pdf"
                        onChange={onChange}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <div className="popup-actions">
                        <button type="submit">Guardar Cambios</button>
                        <button type="button" onClick={handleClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
