import {
  IconBriefcase,
  IconColumns,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import { lazy } from "react";

const Accounts = lazy(() => import("../pages/Accounts"));
const Portfolio = lazy(() => import("../pages/Portfolio"));
const Arbitrage = lazy(() => import("../pages/Arbitrage"));

export const mainRoutes = [
  {
    path: "/",
    label: "Portfolio",
    icon: IconBriefcase,
    element: <Portfolio />,
  },
  {
    path: "/orders",
    label: "Orders",
    icon: IconColumns,
    element: <IconSettings />,
  },
  {
    path: "/accounts",
    label: "Accounts",
    icon: IconUserCircle,
    element: <Accounts />,
  },
];

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/arbitrage",
            element: <Arbitrage />,
          },
          ...mainRoutes.map((item) => ({
            path: item.path,
            element: item.element,
          })),
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
