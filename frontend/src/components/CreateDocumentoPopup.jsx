import "@styles/documentosPractica.css";

export default function CreateDocumentoPopup({ show, setShow, onCreate, error, rol }) {
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
                    <h1>Subir Documento</h1>
                    <button className="popup-close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Nombre del Documento:</label>
                    <input
                        type="text"
                        name="nombre"
                        required
                        placeholder="Ingresa el nombre del documento"
                    />

                    {rol !== "usuario" && (
                        <>
                            <label>Especialidad:</label>
                            <select name="especialidad" required>
                                <option value="">Selecciona una especialidad</option>
                                <option value="Mecánica automotriz">Mecánica automotriz</option>
                                <option value="Electricidad">Electricidad</option>
                                <option value="Electrónica">Electrónica</option>
                            </select>
                        </>
                    )}

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
