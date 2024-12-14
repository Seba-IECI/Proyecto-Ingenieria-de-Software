import React, { useState } from "react";
import useCreateTarea from "@hooks/tarea/useCreateTarea";
import useGetTarea from "@hooks/tarea/useGetTarea";
import useUpTarea from "@hooks/tarea/useUpTarea";
import useDelTarea from "@hooks/tarea/useDelTarea";
import useDesTarea from "@hooks/tarea/useDesTarea";
import useHabTarea from "@hooks/tarea/useHabTarea";
import "@styles/createTarea.css";
import "@styles/tareaItem.css";
import TareaForm from "@components/tareaForm";
import DeleteConfirmation from "@components/deleteTarea";

const Tarea = () => {
  const { handleCreate } = useCreateTarea();
  const { tareas, loading, error, refetch } = useGetTarea();
  const { fetchUpTarea } = useUpTarea();
  const { fetchDelTarea } = useDelTarea();
  const { fetchDesTarea } = useDesTarea();
  const { fetchHabTarea } = useHabTarea();

  const [dataTarea, setDataTarea] = useState({
    titulo: "",
    descripcion: "",
    fecha_entrega: "",
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteTareaId, setDeleteTareaId] = useState(null);
  const [createMessage, setCreateMessage] = useState("");

  const handleFieldChange = (field, value) => {
    setDataTarea((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    const { id, titulo, descripcion, fecha_entrega } = dataTarea;

    if (!titulo || !descripcion || !fecha_entrega) {
      setCreateMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (id) {
        await fetchUpTarea(dataTarea, id);
        setCreateMessage("Tarea actualizada exitosamente.");
      } else {
        await handleCreate(dataTarea);
        setCreateMessage("Tarea creada exitosamente.");
      }
      setDataTarea({ titulo: "", descripcion: "", fecha_entrega: "" });
      setIsPopupOpen(false);
      await refetch();
    } catch (error) {
      console.error("Error:", error);
      setCreateMessage("Ocurrió un error.");
    }
  };

  const handleDeleteTarea = async () => {
    if (!deleteTareaId) return;

    try {
      await fetchDelTarea(deleteTareaId);
      setCreateMessage("Tarea eliminada exitosamente.");
      setIsDeletePopupOpen(false);
      await refetch();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      setCreateMessage("Ocurrió un error al eliminar la tarea.");
    }
  };

  const handleToggleTarea = async (id, isEnabled) => {
    try {
      if (isEnabled) {
        await fetchDesTarea(id);
        setCreateMessage("Tarea deshabilitada.");
      } else {
        await fetchHabTarea(id);
        setCreateMessage("Tarea habilitada.");
      }
      await refetch();
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
      setCreateMessage("Ocurrió un error al cambiar el estado de la tarea.");
    }
  };

  const handleOpenCreate = () => {
    setDataTarea({ titulo: "", descripcion: "", fecha_entrega: "" });
    setIsPopupOpen(true);
  };

  const handleOpenEdit = (tarea) => {
    setDataTarea(tarea);
    setIsPopupOpen(true);
  };

  const handleOpenDeletePopup = (id) => {
    setDeleteTareaId(id);
    setIsDeletePopupOpen(true);
  };

  return (
    <div className="create-section">
      <h2>Gestión de Tareas</h2>
      <button className="create-button" onClick={handleOpenCreate}>
        Crear Tarea
      </button>

      {isPopupOpen && (
        <TareaForm
          data={dataTarea}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleFormSubmit}
          onChange={handleFieldChange}
        />
      )}

      {isDeletePopupOpen && (
        <DeleteConfirmation
          onConfirm={handleDeleteTarea}
          onCancel={() => setIsDeletePopupOpen(false)}
        />
      )}

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
                <div className="button-group">
                  <button
                    className="edit-button"
                    onClick={() => handleOpenEdit(tarea)}
                  >
                    ✏️
                  </button>
                  <button
                    className="toggle-button"
                    onClick={() => handleToggleTarea(tarea.id, tarea.habilitada)}
                  >
                    {tarea.habilitada ? "Deshabilitar" : "Habilitar"}
                  </button>
                </div>
                <div className="button-group">
                  <button
                    className="elim-button"
                    onClick={() => handleOpenDeletePopup(tarea.id)}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay tareas.</p>
        )}
      </div>

      <p>{createMessage}</p>
    </div>
  );
};

export default Tarea;
