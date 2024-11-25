import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Inventario from '@pages/Inventario';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Materia from '@pages/Materia';

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
          <ProtectedRoute allowedRoles={['administrador', 'profesor']}>
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
        )
      }
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