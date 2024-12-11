import React from 'react';
import '@styles/EditMateriaPopup.css';

const EditarMateriaPopup = ({
    isOpen,
    editData,
    setEditData,
    handleEditMateria,
    setIsEditPopupOpen,
    editMessage,
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="popup-overlay" onClick={() => setIsEditPopupOpen(false)}></div>
            <div className="popup">
                <span className="close" onClick={() => setIsEditPopupOpen(false)}>&times;</span>
                <h2>Editar Materia</h2>
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
                <button onClick={handleEditMateria}>Actualizar Materia</button>
                {editMessage && <p>{editMessage}</p>}
            </div>
        </>
    );
};

export default EditarMateriaPopup;
