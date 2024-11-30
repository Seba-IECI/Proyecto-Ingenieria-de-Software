import { useState } from "react";
import { verDocumentos } from "@services/documentosPractica.service";
import useSubirDocumento from "@hooks/documentos/useSubirDocumento";
import useEliminarDocumento from "@hooks/documentos/useEliminarDocumento";
import useModificarDocumento from "@hooks/documentos/useModificarDocumento";
import CreateDocumentoPopup from "@components/CreateDocumentoPopup";
import EditDocumentoPopup from "@components/EditDocumentoPopup";
import "@styles/documentosPractica.css";

export default function DocumentosPractica() {
    const [documentos, setDocumentos] = useState([]);
    const [isViewing, setIsViewing] = useState(false);

    const {
        isPopupOpen: isCreatePopupOpen,
        handleClickCreate,
        handleClosePopup: handleCloseCreatePopup,
        handleCreate,
        originalName,
    } = useSubirDocumento(() => handleVerDocumentos());

    const { handleDelete } = useEliminarDocumento(setDocumentos);

    const {
        isPopupOpen: isEditPopupOpen,
        handleClickEdit,
        handleClosePopup: handleCloseEditPopup,
        handleUpdate,
        handleChange,
        selectedDocumento,
        error,
    } = useModificarDocumento(setDocumentos);

    const handleVerDocumentos = async () => {
        if (isViewing) {
            setIsViewing(false);
            return;
        }

        try {
            const response = await verDocumentos();
            const documentosProcesados = response.map((doc) => {
                const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : null;
                const fecha = updatedAt
                    ? new Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", dateStyle: "short" }).format(updatedAt)
                    : "No Disponible";
                const hora = updatedAt
                    ? new Intl.DateTimeFormat("es-CL", {
                        timeZone: "America/Santiago",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    }).format(updatedAt)
                    : "No Disponible";

                return {
                    id: doc.id,
                    especialidad: doc.especialidad,
                    encargadoPracticasId: doc.encargadoPracticasId,
                    alumnoId: doc.alumnoId,
                    fechaSubida: fecha,
                    horaSubida: hora,
                    nombre: doc.originalname || "Sin Nombre",
                    url: doc.documento,
                };
            });

            console.log("Documentos actualizados:", documentosProcesados);

            setDocumentos(documentosProcesados);
            setIsViewing(true);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        }
    };


    return (
        <div className="documentos-container">
            <h1 className="documentos-title">Documentos de Práctica</h1>
            <div className="documentos-actions">
                <button onClick={handleVerDocumentos} className="documentos-button">
                    {isViewing ? "Ocultar Documentos" : "Ver Documentos"}
                </button>
                <button onClick={handleClickCreate} className="documentos-button">
                    Subir Documento
                </button>
            </div>

            {originalName && (
                <p className="documentos-name">
                    <strong>Nombre del Último Archivo Subido:</strong> {originalName}
                </p>
            )}

            {isViewing && documentos.length > 0 ? (
                <ul className="documentos-list">
                    {documentos.map((documento) => (
                        <li key={documento.id} className="documento-item">
                            <div className="documento-header">
                                <button
                                    onClick={() => handleClickEdit(documento)}
                                    className="edit-button"
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => handleDelete(documento.id)}
                                    className="delete-button"
                                >
                                    Eliminar
                                </button>
                            </div>
                            <div className="documento-info">
                                <p><strong>ID Documento:</strong> {documento.id}</p>
                                <p><strong>Especialidad:</strong> {documento.especialidad}</p>
                                {documento.encargadoPracticasId ? (
                                    <p><strong>Encargado ID:</strong> {documento.encargadoPracticasId}</p>
                                ) : (
                                    <p><strong>Alumno ID:</strong> {documento.alumnoId}</p>
                                )}
                                <p><strong>Fecha Subida:</strong> {documento.fechaSubida}</p>
                                <p><strong>Hora:</strong> {documento.horaSubida}</p>
                                <p><strong>Nombre:</strong> {documento.nombre}</p>
                                <a
                                    href={documento.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="documento-link"
                                >
                                    Abrir Documento
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : isViewing ? (
                <p className="documentos-empty">No se encontraron documentos.</p>
            ) : null}

            <CreateDocumentoPopup
                show={isCreatePopupOpen}
                setShow={handleCloseCreatePopup}
                onCreate={handleCreate}
            />
            <EditDocumentoPopup
                show={isEditPopupOpen}
                setShow={handleCloseEditPopup}
                data={selectedDocumento}
                onUpdate={handleUpdate}
                onChange={handleChange}
                error={error}
            />
        </div>
    );
}