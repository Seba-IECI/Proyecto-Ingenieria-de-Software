import { useState } from "react";
import useListarSemestres from "@hooks/semestres/useListarSemestres";
import useCrearSemestre from "@hooks/semestres/useCrearSemestre";
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

    const [isViewing, setIsViewing] = useState(false);
    const [isCreatingFormVisible, setIsCreatingFormVisible] = useState(false);

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
        </div>
    );
}
