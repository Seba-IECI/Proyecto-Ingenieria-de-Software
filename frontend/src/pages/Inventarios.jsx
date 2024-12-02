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
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false); 
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

  
  const handleEditClick = (inventario) => {
    console.log("Inventario seleccionado para editar:", inventario);
    setSelectedInventario(inventario);
    setIsEditPopupOpen(true);
  };
  

 
  const handleSelectedInventarioChange = (e) => {
    const { name, value } = e.target;
    setSelectedInventario((prev) => ({ ...prev, [name]: value }));
  };


  const handleUpdateInventario = async () => {
    try {
      await updateInventario(selectedInventario.id, selectedInventario); 
      const response = await getInventarios(); 
      setInventarios(response);
      setIsEditPopupOpen(false); 
    } catch (error) {
      console.error("Error al actualizar el inventario:", error);
    }
  };

  
  const handleCreateInventario = async () => {
    try {
      await createInventario(newInventario);
      await fetchInventarios();
      setIsCreatePopupOpen(false); 
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
      setIsEditPopupOpen(false); 
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
                <p><strong>Rut Encargado:</strong> {inventario.encargado}</p>             
                 </div>
              <div className="inventario-actions">
                
                <button className="edit-button"
                  onClick={() => handleEditClick(inventario)} 
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