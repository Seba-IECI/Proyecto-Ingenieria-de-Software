import React from "react"; 

const TareaForm = ({ data, onClose, onSubmit, onChange }) => (
  <div className="popup">
    <div className="popup-inner">
      <button onClick={onClose}>Cerrar</button>
      <h3>{data.id ? "Editar Tarea" : "Crear Tarea"}</h3>
      <input
        type="text"
        placeholder="Título"
        value={data.titulo}
        onChange={(e) => onChange("titulo", e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripción"
        value={data.descripcion}
        onChange={(e) => onChange("descripcion", e.target.value)}
      />
      <input
        type="date"
        placeholder="Fecha de Entrega"
        value={data.fecha_entrega}
        onChange={(e) => onChange("fecha_entrega", e.target.value)}
      />
      <button onClick={onSubmit}>{data.id ? "Guardar Cambios" : "Crear"}</button>
    </div>
  </div>
);

export default TareaForm;
