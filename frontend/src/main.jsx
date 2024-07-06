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
import PeriodosElectivos from "./routes/Tricel/PeriodosElectivos.jsx";
import ListaGanadora from "./routes/Tricel/ListaGanadora.jsx";
import HistorialRevisiones from "./routes/Tricel/HistorialRevisiones.jsx";

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
        path: "/tricel/periodos-electivos",
        element: <PeriodosElectivos />,
      },
      {
        path: "/tricel/lista-ganadora",
        element: <ListaGanadora />,
      },
      {
        path: "/tricel/historial-revisiones",
        element: <HistorialRevisiones />,
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
