import { useState } from 'react';
import useGetMateria from '@hooks/materia/useGetMateria';
import "@styles/materias.css";

const Materias = () => {
    const { materias, loading, error } = useGetMateria();

    return (
        <div className="materia-container">
            <header className="materia-header">
                <h1>Apartado de Materias</h1>
            </header>

            <main className="materia-content">
                {loading && (
                    <p className="loading">Cargando materias...</p>
                )}

                {error && (
                    <p className="error">{error}</p>
                )}

                <section className="materia-list">
                    <h2>Lista de Materias</h2>
                    {materias.length > 0 ? (
                        <ul className="materias">
                            {materias.map((materia) => (
                                <li key={materia.id} className="materia-item">
                                    <div className="materia-card">
                                        <h3>{materia.titulo}</h3>
                                        <p>{materia.descripcion}</p>
                                        <a
                                            href={materia.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="materia-link"
                                        >
                                            Link de contenido extra
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p>No hay materias disponibles.</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Materias;