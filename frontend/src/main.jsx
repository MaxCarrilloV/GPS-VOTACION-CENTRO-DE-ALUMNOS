// src/main.jsx

import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import Foro from './routes/Foro.jsx';
import Post from './routes/Post.jsx';
import Register from './routes/Register.jsx';
import MiembrosTricel from './routes/Tricel/MiembrosTricel.jsx';
import AñadirTricel from './routes/Tricel/AñadirTricel.jsx';
import Verificacion from './routes/Verificacion.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/tricel/miembros',
        element: <MiembrosTricel />,
      },
      {
        path: '/tricel/miembros/añadir',
        element: <AñadirTricel />,
      }
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/registro',
    element: <Register />,
  },
  {
    path: '/foro',
    element: <Foro />,
  },
  {
    path: '/post/:postId',
    element: <Post />,
  },
  {
    path: '/verificacion',
    element: <Verificacion />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
