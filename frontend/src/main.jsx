import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import Login from "./routes/Login.jsx";
import Foro from "./routes/Foro.jsx";
import Listas from "./routes/Listas.jsx";
import Post from "./routes/Post.jsx";
import Register from "./routes/Register.jsx";
import Postulaciones from "./routes/Tricel/Postulaciones.jsx";
import ListaGanadora from "./routes/Tricel/ListaGanadora.jsx";
import ProcesosElectivos from "./routes/Tricel/ProcesosElectivos.jsx";
import PeriodosElectivos from "./routes/Tricel/PeriodosElectivos.jsx";
import VotacionAdmin from "./routes/Votacion/VotacionAdmin.jsx";
import VotacionForm from "./components/VotacionForm.jsx";
import VotacionUser from "./routes/Votacion/VotacionUser.jsx";
import MiembrosTricel from './routes/Tricel/MiembrosTricel.jsx';
import AñadirTricel from './routes/Tricel/AñadirTricel.jsx';
import Verificacion from './routes/Verificacion.jsx';
import Perfil from './routes/Perfil.jsx';
import MiPerfil from './routes/MiPerfil/MiPerfil.jsx';
import EditarMiPerfil from './routes/MiPerfil/EditarMiPerfil.jsx';
import CrearPost from './routes/CrearPost.jsx';

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
        path:'votaciones',
        element: <VotacionAdmin />,
      },
      {
        path: "/votaciones/crear",
        element: <VotacionForm />,
      },
      {
        path: "/votacionesUser",
        element: <VotacionUser />,
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
      {
        path: "/foro",
        element: <Foro />,
      },
      {path: "/crearpost",
        element: <CrearPost />,
      },
      {
        path: "/post/:postId",
        element: <Post />,
      },
      {
        path: "listas",
        element: <Listas />,
      }
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
    path: '/verificacion',
    element: <Verificacion />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
