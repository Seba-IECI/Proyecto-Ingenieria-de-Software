import { useEffect, useState } from "react";
import {
  createInventario,
  deleteInventario,
  getInventarios,
  updateInventario,
} from "@services/inventario.service";
import CreateInventarioPopup from "@components/CreateInventarioPopup";
import EditInventarioPopup from "../components/EditInventarioPopup";
import "@styles/inventario.css";

export default function Inventarios() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false); // Popup de creación
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); 
  const [newInventario, setNewInventario] = useState({
    nombre: "",
    descripcion: "",
    encargadoRut: "",
  });

 

  const fetchInventarios = async () => {
    try {
      const response = await getInventarios();
      setInventarios(response);
    } catch (error) {
      console.error("Error: ", error);
      setError("No se pudieron cargar los inventarios");
    } finally {
      setLoading(false);
    }
  };

  // Abrir el popup de edición con los datos del inventario seleccionado
  const handleEditClick = (inventario) => {
    console.log("Inventario seleccionado para editar:", inventario);
    setSelectedInventario(inventario);
    setIsEditPopupOpen(true);
  };
  

  // Manejar cambios en el formulario del inventario seleccionado
  const handleSelectedInventarioChange = (e) => {
    const { name, value } = e.target;
    setSelectedInventario((prev) => ({ ...prev, [name]: value }));
  };

  // Actualizar el inventario seleccionado
  const handleUpdateInventario = async () => {
    try {
      await updateInventario(selectedInventario.id, selectedInventario); // Llama al servicio con el ID y los datos
      const response = await getInventarios(); // Actualiza la lista de inventarios
      setInventarios(response);
      setIsEditPopupOpen(false); // Cierra el popup de edición
    } catch (error) {
      console.error("Error al actualizar el inventario:", error);
    }
  };

  // Crear un nuevo inventario
  const handleCreateInventario = async () => {
    try {
      await createInventario(newInventario);
      await fetchInventarios();
      setIsCreatePopupOpen(false); // Cierra el popup de creación
    } catch (error) {
      console.error("Error al crear inventario:", error);
      setError("No se pudo crear el inventario");
    }
  };

  const handleDeleteInventario = async (id) => {

    console.log(
      "Intentando eliminar inventario:",
      { id, selectedInventario }
    );
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este inventario?"
      
    );
    
    if (!confirmDelete) {
      console.log("Eliminación cancelada por el usuario.");
      return;
    }
  
    try {
      await deleteInventario(id);
      const updatedInventarios = inventarios.filter(
        (inventario) => inventario.id !== id
      );
      setInventarios(updatedInventarios);
      setIsEditPopupOpen(false); // Cierra el popup de edición después de eliminar
    } catch (error) {
      console.error("Error al eliminar el inventario:", error);
      setError("No se pudo eliminar el inventario.");
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      
      await fetchInventarios();
    };
    fetchData();
  }, []);

  if (loading) return <p>Cargando inventarios...</p>;
  if (error) return <p>Error: {error}</p>;



  return (
    <div className="inventario-container">
      <h1 className="inventario-title">Inventarios</h1>
      {inventarios?.length > 0 ? (
        <ul className="inventario-list">
          {inventarios.map((inventario) => (
            <li key={inventario.id} className="inventario-item">
              <div>
                <p>
                  <strong>Nombre del inventario:</strong> {inventario.nombre}
                </p>
                <p>
                  <strong>Descripción:</strong> {inventario.descripcion}
                </p>
                <p>
                  <strong>Cantidad de ítems:</strong> {inventario.itemcount}
                </p>
                <p><strong>Rut Encargado:</strong> {inventario.encargado}</p>              </div>
              <div className="inventario-actions">
                {/* Botón para abrir el popup de edición */}
                <button className="edit-button"
                  onClick={() => handleEditClick(inventario)} // Usa la función correcta
                  >
                    Editar
                  </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="inventario-empty">No hay inventarios</p>
      )}

      {/* Botón para abrir el popup de creación */}
      <div className= "menu-lateral mostrar">
        <div className="admin-section">
      <button
        className="admin-button"
        onClick={() => setIsCreatePopupOpen(true)}
      >
        Crear Inventario
      </button>
      </div>
      
      </div>

      {/* Popup de creación */}
      <CreateInventarioPopup
        show={isCreatePopupOpen}
        setShow={setIsCreatePopupOpen}
        data={newInventario}
        onChange={(e) =>
          setNewInventario((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        onCreate={handleCreateInventario}
      />

      {/* Popup de edición */}
      <EditInventarioPopup
        show={isEditPopupOpen}
        setShow={setIsEditPopupOpen}
        data={selectedInventario || { nombre: "", descripcion: "", encargadoRut: "" }}
        onChange={handleSelectedInventarioChange}
        onUpdate={handleUpdateInventario}
        onDelete={() => handleDeleteInventario(selectedInventario.id)}
      />
    </div>
  );
}