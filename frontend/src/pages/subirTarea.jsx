import useSubirTarea from "@hooks/documentosTarea/useSubirTarea";
import CreateDocumentoPopup from "@components/documentoTareaPopup";
import "@styles/documentosPractica.css";

export default function SubirDocumentos({ fetchDocumentos }) {
    const {
        isPopupOpen: isCreatePopupOpen,
        handleClickCreate,
        handleClosePopup: handleCloseCreatePopup,
        handleCreate,
    } = useSubirTarea(fetchDocumentos);

    return (
        <div className="documentos-container">
            <h1 className="documentos-title">Subir Tarea</h1>
            <div className="documentos-actions">
                <button onClick={handleClickCreate} className="documentos-button">
                    Subir Tarea
                </button>
            </div>

            <CreateDocumentoPopup
                show={isCreatePopupOpen}
                setShow={handleCloseCreatePopup}
                onCreate={handleCreate}
            />
        </div>
    );
}
