import { useState, useEffect } from 'react';
import useSubirMateria from '@hooks/materia/useSubirMateria';
import useGetMateria from '@hooks/materia/useGetMateria';
import useDelMateria from '@hooks/materia/useDelMateria';
import useUpMateria from '@hooks/materia/useUpMateria';

const Materia = () => {
    const { handleClickCreate, handleCreate, isPopupOpen, dataMateria, setDataMateria } = useSubirMateria();
    const { fetchGetMaterias, materias } = useGetMateria();
    const { fetchDelMateria } = useDelMateria();
    const { fetchUpMateria } = useUpMateria();

    const [deleteId, setDeleteId] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [createMessage, setCreateMessage] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [editData, setEditData] = useState({ titulo: '', descripcion: '', url: '' });
    const [editId, setEditId] = useState('');


    const handleDeleteMateria = async (id) => {
        if (!id) {
            setDeleteMessage('Por favor, ingresa un ID válido para eliminar.');
            return;
        }
        const response = await fetchDelMateria(id);
        setDeleteMessage(response.success ? `Materia eliminada: ${id}` : `Error: ${response.error}`);
        if (response.success) fetchGetMaterias(); // Refrescar lista tras eliminar
    };

    const handleCreateMateria = () => {
        if (!dataMateria.titulo || !dataMateria.descripcion || !dataMateria.url) {
            setCreateMessage('Todos los campos son obligatorios para crear una materia.');
            return;
        }
        handleCreate(dataMateria);
        setCreateMessage('Materia creada exitosamente.');
        fetchGetMaterias(); // Refrescar lista tras crear
    };

    const handleEditMateria = async () => {
        if (!editId || !editData.titulo || !editData.descripcion) {
            setEditMessage('Todos los campos son obligatorios para editar la materia.');
            return;
        }
        await fetchUpMateria(editData, editId);
        setEditMessage('Materia actualizada exitosamente.');
        fetchGetMaterias(); // Refrescar lista tras editar
    };

    return (
        <div>
            <h1>Gestión de Materias</h1>

            {/* Mostrar todas las materias */}
            <div>
                <h2>Lista de Materias</h2>
                {materias.length > 0 ? (
                    <ul>
                        {materias.map((materia) => (
                            <li key={materia.id}>
                                <h3>{materia.nombre}</h3>
                                <p>{materia.descripcion}</p>
                                <a href={materia.url} target="_blank" rel="noopener noreferrer">
                                    Ver más
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay materias disponibles.</p>
                )}
            </div>

            {/* Eliminar Materia */}
            <div>
                <h2>Eliminar Materia</h2>
                <input
                    type="text"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                    placeholder="ID de la Materia a eliminar"
                />
                <button onClick={() => handleDeleteMateria(deleteId)}>
                    Eliminar Materia
                </button>
                {deleteMessage && <p>{deleteMessage}</p>}
            </div>

            {/* Crear Nueva Materia */}
            <div>
                <h2>Crear Nueva Materia</h2>
                <button onClick={handleClickCreate}>Crear Materia</button>
                {isPopupOpen && (
                    <div>
                        <input
                            type="text"
                            placeholder="Título"
                            value={dataMateria.titulo}
                            onChange={(e) =>
                                setDataMateria({ ...dataMateria, titulo: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={dataMateria.descripcion}
                            onChange={(e) =>
                                setDataMateria({ ...dataMateria, descripcion: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            value={dataMateria.url}
                            onChange={(e) =>
                                setDataMateria({ ...dataMateria, url: e.target.value })
                            }
                        />
                        <button onClick={handleCreateMateria}>
                            Guardar Materia
                        </button>
                        {createMessage && <p>{createMessage}</p>}
                    </div>
                )}
            </div>

            {/* Editar Materia */}
            <div>
                <h2>Editar Materia</h2>
                <input
                    type="text"
                    placeholder="ID de la Materia a editar"
                    value={editId}
                    onChange={(e) => setEditId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nuevo Título"
                    value={editData.titulo}
                    onChange={(e) => setEditData({ ...editData, titulo: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Nueva Descripción"
                    value={editData.descripcion}
                    onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Nuevo URL"
                    value={editData.url}
                    onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                />
                <button onClick={handleEditMateria}>
                    Actualizar Materia
                </button>
                {editMessage && <p>{editMessage}</p>}
            </div>
        </div>
    );
};

export default Materia;
