import {
  IconBriefcase,
  IconColumns,
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
const Orders = lazy(() => import("../pages/Orders"));
const Workers = lazy(() => import("../pages/Workers"));
const Robots = lazy(() => import("../pages/Robots"));
const WorkerDetailed = lazy(() => import("../pages/WorkerDetailed"));

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
    element: <Orders />,
  },
  {
    path: "/accounts",
    label: "Accounts",
    icon: IconUserCircle,
    element: <Accounts />,
  },
  {
    path: "/robots",
    label: "Robots",
    icon: IconUserCircle,
    element: <Robots />,
  },
  {
    path: "/workers",
    label: "Workers",
    icon: IconUserCircle,
    element: <Workers />,
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
            path: "/workers/:workerId",
            element: <WorkerDetailed />,
          },
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
