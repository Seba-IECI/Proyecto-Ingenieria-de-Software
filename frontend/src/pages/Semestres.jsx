import { useState } from "react";
import useListarSemestres from "@hooks/semestres/useListarSemestres";
import useCrearSemestre from "@hooks/semestres/useCrearSemestre";
import useEliminarSemestre from "@hooks/semestres/useEliminarSemestre";
import useActualizarSemestre from "@hooks/semestres/useActualizarSemestre";
import DeleteSemestresPopup from "@components/DeleteSemestresPopup";
import UpdateSemestrePopup from "@components/UpdateSemestrePopup";
import "@styles/semestres.css";

export default function Semestres() {
    const { semestresActivos, semestresInactivos, loading, error, fetchSemestres } = useListarSemestres();
    const {
        formData,
        isLoading: isCreating,
        error: createError,
        handleChange,
        handleSubmit,
    } = useCrearSemestre(fetchSemestres);

    const { handleDelete } = useEliminarSemestre(fetchSemestres);

    const {
        semestreData,
        isLoading: isUpdating,
        error: updateError,
        handleChange: handleUpdateChange,
        handleUpdate,
        setInitialData,
    } = useActualizarSemestre(fetchSemestres);

    const [isViewing, setIsViewing] = useState(false);
    const [isCreatingFormVisible, setIsCreatingFormVisible] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [updatePopupVisible, setUpdatePopupVisible] = useState(false);
    const [semestreToUpdate, setSemestreToUpdate] = useState(null);
    const [existeOtroActivo, setExisteOtroActivo] = useState(false);
    const [mostrarTooltip, setMostrarTooltip] = useState(false);

    const handleListarSemestres = async () => {
        if (isViewing) {
            setIsViewing(false);
            return;
        }
        await fetchSemestres();
        setIsViewing(true);
    };

    const handleToggleCrearSemestre = () => {
        setIsCreatingFormVisible(!isCreatingFormVisible);
    };

    const handleShowDeletePopup = (semestre) => {
        setSemestreToUpdate(semestre);
        setPopupVisible(true);
    };

    const handleCloseDeletePopup = () => {
        setPopupVisible(false);
        setSemestreToUpdate(null);
    };

    const handleShowUpdatePopup = (semestre) => {
        setInitialData(semestre);
        setSemestreToUpdate(semestre);
        setUpdatePopupVisible(true);

        const otroActivo = semestresActivos.some(
            (s) => s.id !== semestre.id && s.estado === true
        );
        setExisteOtroActivo(otroActivo);
    };

    const handleCloseUpdatePopup = () => {
        setUpdatePopupVisible(false);
        setSemestreToUpdate(null);
    };

    const handleConfirmDelete = async () => {
        if (semestreToUpdate) {
            await handleDelete(semestreToUpdate.id);
            handleCloseDeletePopup();
        }
    };

    const handleConfirmUpdate = async () => {
        if (semestreToUpdate) {
            await handleUpdate(semestreToUpdate.id);
            handleCloseUpdatePopup();
        }
    };

    const handleCheckboxClick = (e) => {
        if (existeOtroActivo && !semestreData.estado) {
            e.preventDefault();
            setMostrarTooltip(true);
            setTimeout(() => setMostrarTooltip(false), 3000);
        } else {
            handleUpdateChange(e);
        }
    };

    return (
        <div className="semestres-container">
            <h1 className="semestres-title">Gestión de Semestres</h1>
            <div className="semestres-actions">
                <button onClick={handleListarSemestres} className="semestres-button">
                    {isViewing ? "Ocultar Semestres" : "Ver Semestres"}
                </button>
                <button onClick={handleToggleCrearSemestre} className="semestres-button">
                    {isCreatingFormVisible ? "Ocultar Crear Semestre" : "Crear Semestre"}
                </button>
            </div>
            {isCreatingFormVisible && (
                <form className="semestres-form" onSubmit={handleSubmit}>
                    <h2 className="semestres-form-title">Crear Semestre</h2>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Fecha de Inicio:
                        <input
                            type="date"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Fecha de Fin:
                        <input
                            type="date"
                            name="fechaFin"
                            value={formData.fechaFin}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Activo:
                        <input
                            type="checkbox"
                            name="estado"
                            checked={formData.estado}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" className="semestres-button" disabled={isCreating}>
                        {isCreating ? "Creando..." : "Crear Semestre"}
                    </button>
                    {createError && <p className="semestres-error">{createError}</p>}
                </form>
            )}
            {loading && <p className="semestres-loading">Cargando semestres...</p>}
            {error && <p className="semestres-error">Error: {error}</p>}
            {isViewing && (
                <>
                    <h2 className="semestres-subtitle">Semestre Activo</h2>
                    {semestresActivos.length > 0 ? (
                        <ul className="semestres-list">
                            {semestresActivos.map((semestre) => (
                                <li key={semestre.id} className="semestre-item">
                                    <button
                                        className="update-button"
                                        onClick={() => handleShowUpdatePopup(semestre)}
                                    >
                                        ✎
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleShowDeletePopup(semestre)}
                                    >
                                        X
                                    </button>
                                    <p><strong>Nombre:</strong> {semestre.nombre}</p>
                                    <p><strong>Inicio:</strong> {semestre.fechaInicio}</p>
                                    <p><strong>Fin:</strong> {semestre.fechaFin}</p>
                                    <p><strong>Descripción:</strong> {semestre.descripcion}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="semestres-empty">No hay semestres activos.</p>
                    )}
                    <h2 className="semestres-subtitle">Semestres Inactivos</h2>
                    {semestresInactivos.length > 0 ? (
                        <ul className="semestres-list">
                            {semestresInactivos.map((semestre) => (
                                <li key={semestre.id} className="semestre-item">
                                    <button
                                        className="update-button"
                                        onClick={() => handleShowUpdatePopup(semestre)}
                                    >
                                        ✎
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleShowDeletePopup(semestre)}
                                    >
                                        X
                                    </button>
                                    <p><strong>Nombre:</strong> {semestre.nombre}</p>
                                    <p><strong>Inicio:</strong> {semestre.fechaInicio}</p>
                                    <p><strong>Fin:</strong> {semestre.fechaFin}</p>
                                    <p><strong>Descripción:</strong> {semestre.descripcion}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="semestres-empty">No hay semestres inactivos.</p>
                    )}
                </>
            )}
            <DeleteSemestresPopup
                show={popupVisible}
                onClose={handleCloseDeletePopup}
                onConfirm={handleConfirmDelete}
                nombre={semestreToUpdate?.nombre || ""}
            />
            <UpdateSemestrePopup
                show={updatePopupVisible}
                onClose={handleCloseUpdatePopup}
                onUpdate={handleConfirmUpdate}
                semestreData={semestreData}
                isLoading={isUpdating}
                error={updateError}
                handleChange={handleCheckboxClick}
                existeOtroActivo={existeOtroActivo}
                mostrarTooltip={mostrarTooltip}
            />
        </div>
    );
}
