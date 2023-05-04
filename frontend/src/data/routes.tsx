import { IconSettings } from "@tabler/icons-react";
import { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

export const mainRoutes = [
  {
    path: "/",
    label: "Home",
    icon: IconSettings,
    element: <IconSettings />,
  },
  {
    path: "/orders",
    label: "Orders",
    icon: IconSettings,
    element: <IconSettings />,
  },
];

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: mainRoutes.map((item) => ({
          path: item.path,
          element: item.element,
        })),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
