
import '@styles/inventario.css'; // Asegúrate de importar los estilos

export default function CreateInventarioPopup({
  show,
  setShow,
  data,
  onChange,
  onCreate,
}) {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={() => setShow(false)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h1>Crear Nuevo Inventario</h1>
        <form>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={data.nombre}
            onChange={onChange}
            placeholder="Nombre del inventario"
          />
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={data.descripcion}
            onChange={onChange}
            placeholder="Descripción del inventario"
          />
          <label>Encargado (RUT):</label>
          <input
            type="text"
            name="encargadoRut"
            value={data.encargadoRut}
            onChange={onChange}
            placeholder="RUT del encargado"
          />
          <div className="popup-actions">
            <button type="button" onClick={onCreate}>
              Crear
            </button>
            <button type="button" onClick={() => setShow(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
