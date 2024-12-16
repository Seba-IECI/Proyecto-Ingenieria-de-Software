import { useEffect } from "react";
import useListarTareas from "@hooks/documentosTarea/useListarTareas";
import "@styles/listarTarea.css"; 

export default function TareasComponent() {
    const { tareas, loading, error, fetchTareas } = useListarTareas();

    useEffect(() => {
        fetchTareas();
    }, []);

    return (
        <div className="tareas-container">
            <h2 className="tareas-title">Listado de Tareas</h2>
            {loading && <p style={{ color: "blue" }}>Cargando...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!loading && tareas.length === 0 && <p>No hay tareas disponibles</p>}
            {tareas.map((tarea) => (
                <div key={tarea.id} className="tarea-card">
                    <h3 className="tarea-title">{tarea.nombre}</h3>
                    <p>
                        <strong>Archivo:</strong>{" "}
                        <a
                            href={tarea.archivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tarea-link"
                        >
                            {tarea.archivo}
                        </a>
                    </p>
                    <p>
                        <strong>Subido por:</strong>{" "}
                        {tarea.userId?.nombreCompleto || "Desconocido"}
                    </p>
                    <p>
                        <strong>Fecha de subida:</strong>{" "}
                        {new Date(tarea.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
