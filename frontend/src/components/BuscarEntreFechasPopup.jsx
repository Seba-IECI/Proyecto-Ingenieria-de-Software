import { useState } from "react";
import useListarAsistencias from "@hooks/asistencias/useListarAsistencias";
import useEliminarAsistencia from "@hooks/asistencias/useEliminarAsistencia";
import ConfirmPopup from "@components/ConfirmPopup";
import "@styles/asistenciasEliminar.css";

const BuscarEntreFechasPopup = ({ alumnoId, onClose }) => {
    const [semestreId, setSemestreId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { asistencias, loading, error, fetchAsistencias } = useListarAsistencias();
    const { eliminar, loading: deleting, error: deleteError, successMessage, resetState } = useEliminarAsistencia();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleBuscar = () => {
        if (!semestreId || !startDate || !endDate) {
            alert("Por favor completa todos los campos obligatorios (Semestre y Fechas).");
            return;
        }
        fetchAsistencias({ semestreId, alumnoId, startDate, endDate });
        setCurrentPage(1);
        resetState();
    };

    const handleEliminar = async () => {
        if (!selectedId) return;
        await eliminar(selectedId);
        setShowConfirm(false);
        setSelectedId(null);
        fetchAsistencias({ semestreId, alumnoId, startDate, endDate });
    };

    const handleOpenConfirm = (id) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const handleContainerClick = () => {
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = asistencias.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(asistencias.length / itemsPerPage);

    return (
        <div className="popup-container" onClick={handleContainerClick}>
            <div className="popup-content" onClick={handleContentClick}>
                <h2>Buscar Asistencias Entre Fechas</h2>
                <div className="popup-inputs">
                    <label>
                        Semestre ID:
                        <input
                            type="text"
                            placeholder="Ingrese ID del semestre"
                            value={semestreId}
                            onChange={(e) => setSemestreId(e.target.value)}
                        />
                    </label>
                    <label>
                        Fecha Inicio:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <label>
                        Fecha Fin:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                </div>
                <div className="popup-buttons">
                    <button onClick={handleBuscar} className="buscar-button">
                        Buscar
                    </button>
                    <button onClick={onClose} className="cerrar-button">
                        Cerrar
                    </button>
                </div>
                {loading && <p>Cargando asistencias...</p>}
                {error && <p className="error-message">{error}</p>}
                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}
                {deleteError && <p className="error-message">{deleteError}</p>}
                {asistencias.length > 0 && (
                    <div className="asistencias-resultados">
                        <h3>Resultados:</h3>
                        <div className="asistencias-pagination-options">
                            <label>
                                Paginación:
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) =>
                                        setItemsPerPage(
                                            parseInt(e.target.value, 10)
                                        )
                                    }
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </label>
                        </div>

                        <ul>
                            {currentItems.map((asistencia) => (
                                <li key={asistencia.id} className="asistencia-item">
                                    <button
                                        className="asistencia-eliminar-button-entreFechas"
                                        onClick={() =>
                                            handleOpenConfirm(asistencia.id)
                                        }
                                        disabled={deleting}
                                    >
                                        {deleting ? "..." : "Eliminar"}
                                    </button>
                                    <p>
                                        <strong>Fecha:</strong>{" "}
                                        {asistencia.fecha}
                                    </p>
                                    <p>
                                        <strong>Alumno:</strong>{" "}
                                        {asistencia.alumno.nombreCompleto}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        {asistencia.presente
                                            ? "Presente"
                                            : "Ausente"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="asistencias-pagination-controls">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                            >
                                Anterior
                            </button>
                            <span>
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
                {showConfirm && (
                    <ConfirmPopup
                        message="¿Estás seguro de que deseas eliminar esta asistencia?"
                        onConfirm={handleEliminar}
                        onCancel={() => setShowConfirm(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default BuscarEntreFechasPopup;
