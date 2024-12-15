import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            removeActiveClass();
        } else {
            addActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    const addActiveClass = () => {
        const links = document.querySelectorAll('.nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    <li>
                        <NavLink
                            to="/home"
                            onClick={() => {
                                setMenuOpen(false);
                                addActiveClass();
                            }}
                            activeClassName="active"
                        >
                            Inicio
                        </NavLink>
                    </li>
                    {userRole === 'administrador' && (
                        <>
                            <li>
                                <NavLink
                                    to="/users"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/inventarios"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Inventarios
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/semestres"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Semestres
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'profesor' && (
                        <>
                            <li>
                                <NavLink
                                    to="/inventario"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Inventario
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/prestamos"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Prestamos
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/materia"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Materia
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/asistencias"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Asistencias
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/tarea"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Tarea
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/listarTareas"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Listar-Tareas
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'usuario' && (
                        <li>
                            <NavLink
                                to="/porcentaje"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                                Porcentaje Asistencia
                            </NavLink>
                        </li>
                    )}
                    {(userRole === 'usuario' || userRole === 'encargadoPracticas') && (
                        <li>
                            <NavLink
                                to="/documentos"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                                Documentos
                            </NavLink>
                        </li>
                    )}
                    {userRole === 'estudiante' && (
                        <>
                            <li>
                                <NavLink
                                    to="/materias"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Materias
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/tareaEstudiante"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Tarea
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/subirTarea"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                    activeClassName="active"
                                >
                                    Subir-Tarea
                                </NavLink>
                            </li>
                        </>
                    )}
                    <li>
                        <NavLink
                            to="/auth"
                            onClick={() => {
                                logoutSubmit();
                                setMenuOpen(false);
                            }}
                            activeClassName="active"
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;