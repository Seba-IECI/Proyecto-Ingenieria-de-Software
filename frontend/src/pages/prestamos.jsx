import { useEffect, useState } from "react";
import { getPrestamos, cerrarPrestamo, createPrestamo } from "@services/prestamo.service";
import "@styles/prestamos.css";

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredActivos, setFilteredActivos] = useState([]);
  const [filteredCerrados, setFilteredCerrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    rut: "",
    codigosBarras: [],
    diasPrestamo: "",
  });
  const [codigoBarraInput, setCodigoBarraInput] = useState("");
  const [searchTermActivos, setSearchTermActivos] = useState("");
  const [searchTermCerrados, setSearchTermCerrados] = useState("");
  const [popupActivos, setPopupActivos] = useState(false);
  const [popupCerrados, setPopupCerrados] = useState(false);

  const fetchPrestamos = () => {
    setLoading(true);
    getPrestamos()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("El servidor no devolvió una lista de préstamos.");
        }
        setPrestamos(data);
        setFilteredActivos(data.filter((p) => p.estado === 1));
        setFilteredCerrados(data.filter((p) => p.estado === 0));
      })
      .catch((error) => {
        console.error("Error al cargar los préstamos:", error);
        setError("No se pudieron cargar los préstamos.");
        window.alert(`Error al cargar los préstamos: ${error.message || error}`);
      })
      .finally(() => setLoading(false));
  };

  const handleCerrarPrestamo = (id) => {
    cerrarPrestamo(id)
      .then(() => fetchPrestamos())
      .catch((error) => {
        console.error("Error al cerrar el préstamo:", error);
        setError("No se pudo cerrar el préstamo.");
        window.alert(`Error al cerrar el préstamo: ${error.message || error}`);
      });
  };

  const handleCrearPrestamo = () => {
    if (!nuevoPrestamo.rut || nuevoPrestamo.codigosBarras.length === 0 || !nuevoPrestamo.diasPrestamo) {
      console.error("Faltan datos para crear el préstamo:", nuevoPrestamo);
      setError("Por favor, completa todos los campos antes de enviar.");
      window.alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }

    console.log("Datos preparados para enviar:", nuevoPrestamo);

    createPrestamo(nuevoPrestamo)
      .then((response) => {
        if (response?.error) {
          setError(`Error: ${response.error}`);
          window.alert(`Error al crear el préstamo: ${response.error}`);
        } else {
          console.log("Préstamo creado con éxito:", response);
          window.alert(`Préstamo creado exitosamente: ${response.message || "Sin mensaje"}`);
          fetchPrestamos();
          setNuevoPrestamo({ rut: "", codigosBarras: [], diasPrestamo: "" });
        }
      })
      .catch((error) => {
        console.error("Error al crear el préstamo:", error);
        setError("No se pudo crear el préstamo.");
        window.alert(`Error al crear el préstamo: ${error.response?.data?.message || error.message}`);
      });
  };

  const handleAddCodigoBarra = () => {
    if (codigoBarraInput.trim() === "") return;

    setNuevoPrestamo((prev) => ({
      ...prev,
      codigosBarras: [...prev.codigosBarras, codigoBarraInput.trim()],
    }));

    setCodigoBarraInput("");
  };

  const handleRemoveCodigoBarra = (index) => {
    setNuevoPrestamo((prev) => ({
      ...prev,
      codigosBarras: prev.codigosBarras.filter((_, i) => i !== index),
    }));
  };

  const handleSearchActivos = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTermActivos(term);
    setFilteredActivos(
      prestamos.filter(
        (p) =>
          p.estado === 1 &&
          (p.nombreUsuario.toLowerCase().includes(term) ||
            p.codigosBarras.some((cb) => cb.toLowerCase().includes(term)) ||
            p.items.some((item) => item.toLowerCase().includes(term)))
      )
    );
  };

  const handleSearchCerrados = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTermCerrados(term);
    setFilteredCerrados(
      prestamos.filter(
        (p) =>
          p.estado === 0 &&
          (p.nombreUsuario.toLowerCase().includes(term) ||
            p.codigosBarras.some((cb) => cb.toLowerCase().includes(term)) ||
            p.items.some((item) => item.toLowerCase().includes(term)))
      )
    );
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  return (
    <div className="prestamos-container">
      <h1 className="prestamos-title">Préstamos</h1>

      {error && <p className="error">{error}</p>}

      <div className="crear-prestamo">
        <h2>Crear Préstamo</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Usuario:
            <input
              type="text"
              name="usuario"
              value={nuevoPrestamo.rut}
              onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, rut: e.target.value })}
              placeholder="RUT del usuario"
            />
          </label>
          <label>
            Código de Barra:
            <div className="codigo-barra-input">
              <input
                type="text"
                value={codigoBarraInput}
                onChange={(e) => setCodigoBarraInput(e.target.value)}
                placeholder="Código de barra"
              />
              <button type="button" onClick={handleAddCodigoBarra}>
                Añadir
              </button>
            </div>
          </label>
          <ul className="codigos-barras-list">
            {nuevoPrestamo.codigosBarras.map((codigo, index) => (
              <li key={index}>
                {codigo}
                <button type="button" onClick={() => handleRemoveCodigoBarra(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <label>
            Días de Préstamo:
            <input
              type="number"
              name="diasPrestamo"
              value={nuevoPrestamo.diasPrestamo}
              onChange={(e) =>
                setNuevoPrestamo({ ...nuevoPrestamo, diasPrestamo: e.target.value })
              }
              placeholder="Días"
            />
          </label>
          <button type="button" onClick={handleCrearPrestamo}>
            Crear Préstamo
          </button>
        </form>
      </div>

        <div className="popup-buttons">
        <button onClick={() => setPopupActivos(true)}>Ver Préstamos Activos</button>
        <button onClick={() => setPopupCerrados(true)}>Ver Préstamos Cerrados</button>
      </div>

          
      {popupActivos && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Préstamos Activos</h2>
            <input
              type="text"
              placeholder="Buscar en préstamos activos..."
              value={searchTermActivos}
              onChange={handleSearchActivos}
            />
            <table className="prestamos-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Códigos de Barras</th>
                  <th>Items</th>
                  <th>Fecha de Préstamo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivos.map((prestamo) => (
                  <tr key={prestamo.id}>
                    <td>{prestamo.nombreUsuario}</td>
                    <td>
                      <ul>
                        {prestamo.codigosBarras.map((codigo, index) => (
                          <li key={index}>{codigo}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {prestamo.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{new Date(prestamo.fechaPrestamo).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleCerrarPrestamo(prestamo.id)}>Cerrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setPopupActivos(false)}>Cerrar</button>
          </div>
        </div>
      )}
      
      
      {popupCerrados && (
        <div className="popup-overlay">
          <div className="popup-content">
          <button className="popup-close-button" onClick={() => setPopupCerrados(false)}>Cerrar</button>
            <h2>Préstamos Cerrados</h2>

            <input
              type="text"
              placeholder="Buscar en préstamos cerrados..."
              value={searchTermCerrados}
              onChange={handleSearchCerrados}
            />
            <table className="prestamos-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Códigos de Barras</th>
                  <th>Items</th>
                  <th>Fecha de Préstamo</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerrados.map((prestamo) => (
                  <tr key={prestamo.id}>
                    <td>{prestamo.nombreUsuario}</td>
                    <td>
                      <ul>
                        {prestamo.codigosBarras.map((codigo, index) => (
                          <li key={index}>{codigo}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {prestamo.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{new Date(prestamo.fechaPrestamo).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        </div>
      )}
      
    </div>
  );
}
