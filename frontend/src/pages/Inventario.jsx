import { useEffect, useState } from "react";
import { createInventario, getInventarios, getInventarioById } from "@services/inventario.service";


export default function Inventario() {
  
  const [inventarios, setInventarios] = useState([]);

  const fetchInventarios = async () => {
    try {
      const response = await getInventarios();
      console.log("Response from getInventarios:", response);
      setInventarios(response);
    } catch (error) {
      console.error( 'Error: ', error );
    }
  }


    const fetchInventarioById = async (id) => {
      try {
        const response = await getInventarioById(id);
      } catch (error) {
        console.error( 'Error: ', error );
      }

    }

    const postInventario = async (newInventario) => {
      try {
          const response = await createInventario(newInventario);
          console.log("Response from createInventario:", response);
          setInventarios((prevInventarios) => [...prevInventarios, response]); 
      } catch (error) {
          console.error('Error al crear inventario: ', error);
      }
  };
  

    useEffect(() => {
      fetchInventarios();
    }, []);

    const handleCreateInventario = () => {
      const newInventario = {
          nombre: 'Nuevo Inventario', // usar en el input
          descripcion: 'Descripción del inventario',
          encargadoRut: '18.234.545-5',
          // Otros campos según tu modelo
      };
  
      postInventario(newInventario);
  };
  
  
    return (
    <div>
      <h1>Inventario</h1>
      {inventarios?.length > 0 ? (
        <ul>
          {inventarios.map((inventario) => (
            <li key={inventario.id}>
              <p>Nombre del inventario: {inventario.inventario_nombre}</p>
              <p>Cantidad de ítems: {inventario.itemcount}</p>
            </li>
          ))}
        </ul>
      ) : ( 
        <p>No hay inventarios</p>
      )}
      <div>
          <button onClick={handleCreateInventario}>Crear Inventario</button>
      </div>
    </div>
  );
}