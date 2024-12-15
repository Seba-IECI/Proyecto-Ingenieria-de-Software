import { useEffect } from "react";
import useListarTareas from "@hooks/documentosTarea/useListarTareas";

export default function TareasComponent() {
    const { tareas, loading, error, fetchTareas } = useListarTareas();

    useEffect(() => {
        fetchTareas();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Listado de Tareas</h2>
            {loading && <p style={{ color: "blue" }}>Cargando...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!loading && tareas.length === 0 && <p>No hay tareas disponibles</p>}
            {tareas.map((tarea) => (
                <div
                    key={tarea.id}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        marginBottom: "10px",
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    <h3>{tarea.nombre}</h3>
                    <p>
                        <strong>Archivo:</strong>{" "}
                        <a href={tarea.archivo} target="_blank" rel="noopener noreferrer">
                            {tarea.archivo}
                        </a>
                    </p>
                    <p><strong>Subido por:</strong> {tarea.userId?.nombreCompleto || "Desconocido"}</p>
                    <p><strong>Fecha de subida:</strong> {new Date(tarea.createdAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
