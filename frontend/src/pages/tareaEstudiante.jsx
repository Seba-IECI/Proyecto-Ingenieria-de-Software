import React from "react";
import useGetTarea from "@hooks/tarea/useGetTarea";

const TareaEs = () => {
    const { tareas, loading, error, refetch } = useGetTarea();
  
    return (
      <div className="tarea-list">
        <h2>Lista de Tareas</h2>
        {loading ? (
          <p>Cargando tareas...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : tareas && tareas.length > 0 ? (
          <ul>
            {tareas.map((tarea) => (
              <li key={tarea.id} className="tarea-item">
                <div className="tarea-content">
                  <h3>{tarea.titulo}</h3>
                  <p>{tarea.descripcion}</p>
                  <p>{tarea.fecha_entrega}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay tareas.</p>
        )}
      </div>
    );
  };
  
  export default TareaEs;
  