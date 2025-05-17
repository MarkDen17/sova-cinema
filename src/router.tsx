import { createBrowserRouter } from "react-router";
import FilmsDashboard from "./components/FilmsDashboard";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <Layout />,
    path: "/",
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <FilmsDashboard />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
    ],
  },
]);

export default router;