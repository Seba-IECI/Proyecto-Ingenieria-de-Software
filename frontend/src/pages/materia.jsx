import useSubirMateria from '@hooks/materia/useSubirMateria';



const Materia = () => {
    const { handleClickCreate, handleCreate, isPopupOpen, dataMateria, setDataMateria } = useSubirMateria();

    return (
        <div>
            <h1>Materia</h1>
            <button onClick={handleClickCreate}>Crear Materia</button>
            {isPopupOpen && (
                <div>
                    <input
                        type="text"
                        placeholder="Titulo"
                        value={dataMateria.titulo}
                        onChange={(e) => setDataMateria({ ...dataMateria, titulo: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Descripcion"
                        value={dataMateria.descripcion}
                        onChange={(e) => setDataMateria({ ...dataMateria, descripcion: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={dataMateria.url}
                        onChange={(e) => setDataMateria({ ...dataMateria, url: e.target.value })}
                    />
                    <button onClick={() => handleCreate(dataMateria)}>Crear</button>
                </div>
            )}
        </div>
    );
}

export default Materia;