import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import Login from "./routes/Login.jsx";
import Foro from "./routes/Foro.jsx";
import Post from "./routes/Post.jsx";
import Register from "./routes/Register.jsx";
import Postulaciones from "./routes/Tricel/Postulaciones.jsx";
import ListaGanadora from "./routes/Tricel/ListaGanadora.jsx";
import HistorialRevisiones from "./routes/Tricel/HistorialRevisiones.jsx";
import ProcesosElectivos from "./routes/Tricel/ProcesosElectivos.jsx";
import PeriodosElectivos from "./routes/Tricel/PeriodosElectivos.jsx";
import MiembrosTricel from './routes/Tricel/MiembrosTricel.jsx';
import AñadirTricel from './routes/Tricel/AñadirTricel.jsx';
import Verificacion from './routes/Verificacion.jsx';
import Perfil from './routes/Perfil.jsx';
import MiPerfil from './routes/MiPerfil/MiPerfil.jsx';
import EditarMiPerfil from './routes/MiPerfil/EditarMiPerfil.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/tricel/postulaciones",
        element: <Postulaciones />,
      },
      {
        path: "/tricel/procesos-electivos",
        element: <ProcesosElectivos />,
      },
      {
        path: "/tricel/periodos-electivos",
        element: <PeriodosElectivos/>
      },
      {
        path: "/tricel/lista-ganadora",
        element: <ListaGanadora />,
      },
      {
        path: "/tricel/historial-revisiones",
        element: <HistorialRevisiones />,
      },
      {
        path: '/tricel/miembros',
        element: <MiembrosTricel />,
      },
      {
        path: '/tricel/miembros/añadir',
        element: <AñadirTricel />,
      },
      {
        path: '/perfil',
        element: <Perfil />,
      },
      {
        path: '/mi-perfil',
        element: <MiPerfil />,
      },
      {
        path: '/mi-perfil/editar',
        element: <EditarMiPerfil />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/registro",
    element: <Register />,
  },
  {
    path: "/foro",
    element: <Foro />,
  },
  {
    path: "/post/:postId",
    element: <Post />,
  },
  {
    path: '/verificacion',
    element: <Verificacion />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
