import { useEffect, useState } from "react";
import { getInventarioById } from "@services/inventario.service"; // Servicio ya importado
import { getLoggedUser } from "@services/user.service"; // Función para obtener el usuario
import "@styles/inventario.css";

export default function Inventario() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener inventarios por encargado
  const fetchInventariosPorEncargado = async () => {
    try {
      // Obtener el usuario logueado desde el backend
      const user = await getLoggedUser();
      console.log("Usuario logueado:", user);

      // Validar que exista el RUT
      if (!user?.rut) {
        throw new Error("No se encontró el RUT del usuario logueado.");
      }

      // Obtener inventarios asignados al RUT del encargado
      const inventarios = await getInventarioById(user.rut);
      console.log("Inventarios obtenidos:", inventarios);
      setInventarios(Array.isArray(inventarios) ? inventarios : [inventarios]);

      
    } catch (error) {
      console.error("Error al cargar inventarios por encargado:", error);
      setError("No se pudieron cargar los inventarios asignados.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los inventarios al montar el componente
  useEffect(() => {
    fetchInventariosPorEncargado();
  }, []);

  // useEffect para depuración, verifica los cambios en el estado de inventarios
  useEffect(() => {
    console.log("Estado de inventarios actualizado:", inventarios);
  }, [inventarios]);

  if (loading) return <p>Cargando inventarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="inventario-container">
      <h1 className="inventario-title">Inventario</h1>
      {inventarios.length > 0 ? (
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
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes inventarios asignados.</p>
      )}
    </div>
  );
}
