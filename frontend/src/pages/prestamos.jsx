import { useEffect, useState } from "react";
import {
  getPrestamos,
  cerrarPrestamo,
  createPrestamo,
  addAmonestacion,
  addComentario,
} from "@services/prestamo.service";
import "@styles/prestamos.css";
import { validations } from "@helpers/formatData";
import { format as formatRut } from "rut.js";
import Swal from "sweetalert2";


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
  const [popupAmonestacion, setPopupAmonestacion] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
  const [amonestacionDescripcion, setAmonestacionDescripcion] = useState("");

 

  const handleAddAmonestacion = async (usuarioId) => {
    try {
      
      await addAmonestacion(usuarioId);
      console.log (" envio d ela id al servixcio de front")
      window.alert("Amonestación añadida con éxito.");
    } catch (error) {
      console.error("Error al añadir amonestación:", error);
      window.alert(`Error al añadir amonestación: ${error.message}`);
    }
  };

  const handleAddComentario = async (prestamoId, comentario) => {
    try {
      const error = validations.validateDescripcion(comentario);
    if (error) {
      window.alert(error);
      return;
    }

      await addComentario(prestamoId, comentario);
      
    } catch (error) {
      console.error("Error al añadir comentario:", error);
      window.alert(`Error al añadir comentario: ${error.message}`);
    }
  };

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
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez cerrado, no podrás reabrir este préstamo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar préstamo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarPrestamo(id)
          .then(() => {
            
            Swal.fire("¡Éxito!", "El préstamo se cerró correctamente.", "success");
            
            fetchPrestamos();
          })
          .catch((error) => {
            console.error("Error al cerrar el préstamo:", error);
            setError("No se pudo cerrar el préstamo.");
            Swal.fire("Error", `No se pudo cerrar el préstamo: ${error.message || error}`, "error");
          });
      }
    });
  };
  
  

   const openAmonestacionPopup = (usuarioId, prestamoId) => {
    console.log("Usuario ID recibido:", usuarioId);
    console.log("Préstamo ID recibido:", prestamoId);
    setSelectedUsuarioId(usuarioId);
    setSelectedPrestamoId(prestamoId);
    setPopupAmonestacion(true);
  };

  const handleCrearPrestamo = () => {
    if (!nuevoPrestamo.rut || nuevoPrestamo.codigosBarras.length === 0 || !nuevoPrestamo.diasPrestamo) {
      window.alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }
  
    createPrestamo(nuevoPrestamo)
      .then((response) => {
        if (response?.error || response?.message) {
          console.error("Error en la creación del préstamo:", response.error || response.message);
          window.alert(`Error al crear el préstamo: ${response.error || response.message}`);
          return; 
        }
  
        
        window.alert("Préstamo creado exitosamente.");
        fetchPrestamos();
        setNuevoPrestamo({ rut: "", codigosBarras: [], diasPrestamo: "" });
      })
      .catch((error) => {
        console.error("Error al crear el préstamo:", error);
        window.alert(`Error al crear el préstamo: ${error.response?.data?.message || error.message}`);
      });
  };
  
  

  const handleAddCodigoBarra = () => {
    const error = validations.validateCodigoBarras(codigoBarraInput);
    if (error) {
      window.alert(error); 
      return;
    }
  
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
              onChange={(e) => {
                
                const formattedRut = formatRut(e.target.value); 
                setNuevoPrestamo({ ...nuevoPrestamo, rut: formattedRut });
              }}
              onBlur={() => {
                
                const error = validations.validateRut(nuevoPrestamo.rut); 
                if (error) {
                  window.alert(error); 
                }
              }}
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
              <button type="button" onClick={() => handleAddCodigoBarra()}>
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
            onChange={(e) => {
              const error = validations.validateDiasInventario(Number(e.target.value)); 
              if (error) {
                window.alert(error); 
              } else {
                setNuevoPrestamo({ ...nuevoPrestamo, diasPrestamo: e.target.value }); 
              }
            }}
            placeholder="Días"
          />
          </label>
          <button type="button" onClick={() => handleCrearPrestamo()}>
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
                      <button onClick={() => openAmonestacionPopup(prestamo.rutUsuario, prestamo.id)}>
                        Añadir Amonestación
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setPopupActivos(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {popupAmonestacion && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Añadir Amonestación</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Descripción del Comentario:
                <textarea
                  value={amonestacionDescripcion}
                  onChange={(e) => setAmonestacionDescripcion(e.target.value)}
                  placeholder="Escribe el comentario relacionado con el préstamo"
                />
              </label>
              <button
  onClick={async () => {
    try {
      
      const error = validations.validateDescripcion(amonestacionDescripcion);
      if (error) {
        window.alert(error);
        return; 
      }

      console.log("ID del usuario:", selectedUsuarioId);

      if (selectedUsuarioId) {
        await handleAddAmonestacion(selectedUsuarioId);
        console.log("Amonestación añadida con éxito.");
      }

      if (selectedPrestamoId) {
        await handleAddComentario(selectedPrestamoId, amonestacionDescripcion);
        console.log("Comentario añadido al préstamo con éxito.");
      }

      window.alert("Comentario y amonestación añadidos con éxito.");
      setPopupAmonestacion(false); 
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
      window.alert("Ocurrió un error. Por favor, inténtalo de nuevo.");
    }
  }}
>
  Confirmar
</button>

              <button onClick={() => setPopupAmonestacion(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {popupCerrados && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close-button" onClick={() => setPopupCerrados(false)}>
              Cerrar
            </button>
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
                  <th>Devolución</th>
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
                    <td>{new Date(prestamo.fechaDevolucion).toLocaleString()}</td>
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
