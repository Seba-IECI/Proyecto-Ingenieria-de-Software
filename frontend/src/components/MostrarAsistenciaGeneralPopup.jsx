import { useState } from "react";
import useListarAsistenciasGenerales from "@hooks/asistencias/useListarAsistenciasGenerales";
import useEliminarAsistencia from "@hooks/asistencias/useEliminarAsistencia";
import ConfirmPopup from "@components/ConfirmPopup";
import "@styles/asistenciasEliminar.css";

const MostrarAsistenciaGeneralPopup = ({ onClose }) => {
    const [semestreId, setSemestreId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [hasSearched, setHasSearched] = useState(false); // Nuevo estado para controlar si se ha buscado

    const { asistencias, loading, error, fetchAsistenciasGenerales } =
        useListarAsistenciasGenerales();
    const {
        eliminar,
        loading: deleting,
        error: deleteError,
        successMessage,
        resetState,
    } = useEliminarAsistencia();

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [asistenciaToDelete, setAsistenciaToDelete] = useState(null);

    const handleBuscar = () => {
        if (!semestreId || !startDate || !endDate) {
            alert("Por favor completa todos los campos obligatorios (Semestre y Fechas).");
            return;
        }
        fetchAsistenciasGenerales({ semestreId, startDate, endDate });
        setCurrentPage(1);
        resetState();
        setHasSearched(true); // Marcar que se realizó una búsqueda
    };

    const handleEliminar = async () => {
        if (!asistenciaToDelete) return;
        await eliminar(asistenciaToDelete);
        setShowConfirmPopup(false);
        setAsistenciaToDelete(null);
        fetchAsistenciasGenerales({ semestreId, startDate, endDate }); // Actualiza la lista
    };

    const handleOpenConfirm = (id) => {
        setAsistenciaToDelete(id);
        setShowConfirmPopup(true);
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
                <h2>Mostrar Asistencia General</h2>
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
                {successMessage && <p className="success-message">{successMessage}</p>}
                {deleteError && <p className="error-message">{deleteError}</p>}
                {!loading && hasSearched && currentItems.length === 0 && (
                    <p>No hay asistencias disponibles.</p>
                )}
                {currentItems.length > 0 && (
                    <div className="asistencias-resultados">
                        <div className="asistencias-pagination">
                            <div className="asistencias-pagination-options">
                                <label>
                                    Paginación:
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) =>
                                            setItemsPerPage(parseInt(e.target.value, 10))
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
                        </div>
                        <h3>Resultados:</h3>
                        <ul>
                            {currentItems.map((asistencia) => (
                                <li key={asistencia.id} className="asistencia-item">
                                    <button
                                        className="asistencia-eliminar-button-general"
                                        onClick={() => handleOpenConfirm(asistencia.id)}
                                        disabled={deleting}
                                    >
                                        {deleting ? "..." : "Eliminar"}
                                    </button>
                                    <p>
                                        <strong>Fecha:</strong> {asistencia.fecha}
                                    </p>
                                    <p>
                                        <strong>Alumno:</strong> {asistencia.alumno.nombreCompleto}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        {asistencia.presente ? "Presente" : "Ausente"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="asistencias-pagination-controls">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Anterior
                            </button>
                            <span>
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
                {showConfirmPopup && (
                    <ConfirmPopup
                        onConfirm={handleEliminar}
                        onCancel={() => setShowConfirmPopup(false)}
                        message="¿Estás seguro de que deseas eliminar esta asistencia?"
                    />
                )}
            </div>
        </div>
    );
};

export default MostrarAsistenciaGeneralPopup;
