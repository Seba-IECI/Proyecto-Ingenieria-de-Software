import React, { useState, useEffect } from "react";
import ConfirmDeletePopup from "@components/ElimMateriaPopup";
import useSubirMateria from "@hooks/materia/useSubirMateria";
import useGetMateria from "@hooks/materia/useGetMateria";
import useDelMateria from "@hooks/materia/useDelMateria";
import useUpMateria from "@hooks/materia/useUpMateria";
import EditMateriaPopup from "@components/EditMateriaPopup";
import "@styles/materia.css";
import "@styles/crearMateria.css";

const Materia = () => {
    const { handleClickCreate, handleCreate, isPopupOpen, dataMateria, setDataMateria } = useSubirMateria();
    const { fetchGetMaterias, materias = [] } = useGetMateria(); 
    const { fetchDelMateria } = useDelMateria();
    const { fetchUpMateria } = useUpMateria();

    const [createMessage, setCreateMessage] = useState("");
    const [editMessage, setEditMessage] = useState("");
    const [editData, setEditData] = useState({ titulo: "", descripcion: "", url: "" });
    const [editId, setEditId] = useState("");
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    useEffect(() => {
        fetchGetMaterias().catch((error) => {
            console.error("Error fetching materias:", error);
        });
    }, [fetchGetMaterias]);

    const handleCreateMateria = () => {
        if (!dataMateria.titulo || !dataMateria.descripcion || !dataMateria.url) {
            setCreateMessage("Todos los campos son obligatorios para crear una materia.");
            return;
        }

        const isDuplicate = materias.some((materia) => materia.titulo.toLowerCase() === dataMateria.titulo.toLowerCase());
        if (isDuplicate) {
            setCreateMessage(`Ya existe una materia con el título "${dataMateria.titulo}". Por favor, usa otro nombre.`);
            return;
        }

        handleCreate(dataMateria);
        setCreateMessage("Materia creada exitosamente.");
        fetchGetMaterias();
    };

    const handleEditMateria = async () => {
        if (!editId || !editData.titulo || !editData.descripcion) {
            setEditMessage("Todos los campos son obligatorios para editar la materia.");
            return;
        }
        await fetchUpMateria(editData, editId);
        setEditMessage("Materia actualizada exitosamente.");
        fetchGetMaterias();
        setIsEditPopupOpen(false);
    };

    const handleDeleteMateria = async () => {
        if (!deleteId) return;
        await fetchDelMateria(deleteId);
        fetchGetMaterias();
        setIsDeletePopupOpen(false);
    };

    return (
        <div className="materia-container">
            <h1>Gestión de Materias</h1>
            <div className="materia-list">
                <h2>Lista de Materias</h2>
                {materias && materias.length > 0 ? (
                    <ul>
                        {materias.map((materia) => (
                            <li key={materia.id} className="materia-item">
                                <h3>{materia.titulo}</h3>
                                <p>{materia.descripcion}</p>
                                <a href={materia.url} target="_blank" rel="noopener noreferrer">
                                    Ver más
                                </a>
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        setEditId(materia.id);
                                        setEditData({ titulo: materia.titulo, descripcion: materia.descripcion, url: materia.url });
                                        setIsEditPopupOpen(true);
                                    }}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="elim-button"
                                    onClick={() => {
                                        setDeleteId(materia.id);
                                        setIsDeletePopupOpen(true);
                                    }}
                                >
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay materias disponibles.</p>
                )}
            </div>

            <div className="create-section">
                <h2>Crear Nueva Materia</h2>
                <button onClick={handleClickCreate}>Crear Materia</button>
                {isPopupOpen && (
                    <div className="popup">
                        <span className="close" onClick={() => setIsPopupOpen(false)}>
                            &times;
                        </span>
                        <h2>Agregar Nueva Materia</h2>
                        <input
                            type="text"
                            placeholder="Título"
                            value={dataMateria.titulo}
                            onChange={(e) => setDataMateria({ ...dataMateria, titulo: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={dataMateria.descripcion}
                            onChange={(e) => setDataMateria({ ...dataMateria, descripcion: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            value={dataMateria.url}
                            onChange={(e) => setDataMateria({ ...dataMateria, url: e.target.value })}
                        />
                        <button onClick={handleCreateMateria}>Guardar Materia</button>
                        {createMessage && <p>{createMessage}</p>}
                    </div>
                )}
            </div>

            <ConfirmDeletePopup
                isOpen={isDeletePopupOpen}
                onClose={() => setIsDeletePopupOpen(false)}
                onConfirm={handleDeleteMateria}
                message={`¿Estás seguro de que deseas eliminar la materia con ID ${deleteId}?`}
            />
            <EditMateriaPopup
                isOpen={isEditPopupOpen}
                editData={editData}
                setEditData={setEditData}
                handleEditMateria={handleEditMateria}
                setIsEditPopupOpen={setIsEditPopupOpen}
                editMessage={editMessage}
            />
        </div>
    );
};

export default Materia;
