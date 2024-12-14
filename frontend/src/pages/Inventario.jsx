import { useEffect, useState } from "react";
import {
  getInventarioById,
  getInventarioCompleto,
  deleteItem, 
} from "@services/inventario.service";
import { getLoggedUser } from "@services/user.service";
import "@styles/popup-item.css";
import { useAddItemPopup } from "../hooks/inventario/add-item";
import { useDeleteItemPopup } from "../hooks/inventario/delete-item";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

function Popup({ inventario, onClose }) {

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Informe de Inventario: ${inventario.nombre}`, 10, 10);

    const rows = inventario.items.map((item, index) => [
      index + 1,
      item.nombre,
      item.codigosBarras.length,
      item.codigosBarras.join(", "),
    ]);

    doc.autoTable({
      head: [["#", "Nombre del Ítem", "Cantidad", "Códigos de Barra"]],
      body: rows,
    });

    doc.save(`Informe_${inventario.nombre}.pdf`);
  };

  const exportToExcel = () => {
    const data = inventario.items.map((item, index) => ({
      "#": index + 1,
      "Nombre del Ítem": item.nombre,
      "Cantidad": item.codigosBarras.length,
      "Códigos de Barra": item.codigosBarras.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    XLSX.writeFile(workbook, `Informe_${inventario.nombre}.xlsx`);
  };
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Ítems de {inventario.nombre}</h2>
        {inventario.items && inventario.items.length > 0 ? (
          <div className="grid-container">
            <div className="grid-header">
              <div>
                <strong>Nombre del Ítem</strong>
              </div>
              <div>
                <strong>Cantidad</strong>
              </div>
              <div>
                <strong>Códigos de Barra</strong>
              </div>
            </div>
            {inventario.items.map((item, index) => (
              <div className="grid-row" key={index}>
                <div>{item.nombre}</div>
                <div>{item.codigosBarras.length}</div>
                <div>
                  {item.codigosBarras && item.codigosBarras.length > 0 ? (
                    item.codigosBarras.join(", ")
                  ) : (
                    "Sin códigos de barra"
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay ítems en este inventario.</p>
        )}
        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
        <button onClick={exportToPDF} className="export-button">
          Exportar a PDF
        </button>
        <button onClick={exportToExcel} className="export-button">
          Exportar a Excel
        </button>
      </div>
    </div>
  );
}

export default function Inventario() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const { AddItemPopup, openPopup, closePopup } = useAddItemPopup(inventarios, () => {
    fetchInventariosPorEncargado();
  });

  const fetchInventariosPorEncargado = async () => {
    try {
      const user = await getLoggedUser();
      const inventarios = await getInventarioById(user.rut);
      console

      if (!Array.isArray(inventarios) || inventarios.length === 0) {
        setInventarios([]);
        return;
      }

      const inventariosConUnidades = await Promise.all(
        inventarios.map(async (inv) => {
          const inventarioCompleto = await getInventarioCompleto(inv.id);
          const totalUnidades = inventarioCompleto.items
            ? inventarioCompleto.items.reduce(
                (sum, item) => sum + (Array.isArray(item.codigosBarras) ? item.codigosBarras.length : 0),
                0
              )
            : 0;
          return { ...inv, totalUnidades };
        })
      );

      setInventarios(inventariosConUnidades);
    } catch (error) {
      console.error("Error al cargar inventarios:", error);
      setError("No se pudieron cargar los inventarios asignados.");
    } finally {
      setLoading(false);
    }
  };



 
  const { DeleteItemPopup, openPopup: openDeletePopup, closePopup: closeDeletePopup } =
    useDeleteItemPopup(() => {
      fetchInventariosPorEncargado();
    });

  const handleInventarioClick = async (inventario) => {
    try {
      setLoading(true);
      const inventarioCompleto = await getInventarioCompleto(inventario.id);
      setSelectedInventario(inventarioCompleto);
      setShowPopup(true);
    } catch (error) {
      console.error("Error al cargar el inventario completo:", error);
      setError("No se pudo cargar el inventario completo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventariosPorEncargado();
  }, []);

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
                <p>
                  <strong>Unidades totales:</strong> {inventario.totalUnidades}
                </p>
                <p>
                  <strong>Rut Encargado:</strong> {inventario.encargado}
                </p>
              </div>
              <div className="inventario-actions">
                <button
                  onClick={() => handleInventarioClick(inventario)}
                  className="details-button"
                >
                  Ver Detalles
                </button>
                <button
                  onClick={() => openPopup(inventario.id)}
                  className="add-item-button"
                >
                  Añadir Ítem
                </button>
                <button onClick={openDeletePopup}>Eliminar Ítem</button>

                <DeleteItemPopup />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes inventarios asignados.</p>
      )}

      {showPopup && selectedInventario && (
        <Popup
          inventario={selectedInventario}
          onClose={() => setShowPopup(false)}
        />
      )}


      <AddItemPopup />
    </div>
  );
}
