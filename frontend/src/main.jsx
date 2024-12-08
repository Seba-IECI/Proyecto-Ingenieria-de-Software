import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Inventarios from '@pages/Inventarios';
import Inventario from '@pages/Inventario';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Materia from '@pages/materia';
import DocumentosPractica from '@pages/DocumentosPractica';
import Semestres from '@pages/Semestres';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'profesor']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/inventarios',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Inventarios />
          </ProtectedRoute>
        ),
      },
      {
        path: '/inventario',
        element: (
          <ProtectedRoute allowedRoles={['administrador','profesor']}>
            <Inventario />
          </ProtectedRoute>
        ),
      },
      {
        path: '/materia',
        element: (
          <ProtectedRoute allowedRoles={['profesor']}>
            <Materia />
          </ProtectedRoute>
        ),
      },
      {
        path: '/documentos',
        element: (
          <ProtectedRoute allowedRoles={['usuario', 'encargadoPracticas']}>
            <DocumentosPractica />
          </ProtectedRoute>
        ),
      },
      {
        path: '/semestres',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Semestres />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);