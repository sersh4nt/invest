import {
  IconBriefcase,
  IconColumns,
  IconHistory,
  IconRobot,
  IconSettings2,
  IconTable,
  IconUserCircle,
} from "@tabler/icons-react";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";

const Accounts = lazy(() => import("../pages/Accounts"));
const Portfolio = lazy(() => import("../pages/Portfolio"));
const Arbitrage = lazy(() => import("../pages/Arbitrage"));
const Orders = lazy(() => import("../pages/Orders"));
const Workers = lazy(() => import("../pages/Workers"));
const Robots = lazy(() => import("../pages/Robots"));
const WorkerDetailed = lazy(() => import("../pages/WorkerDetailed"));
const Backtest = lazy(() => import("../pages/Backtest"));
const RobotBacktest = lazy(() => import("../pages/Backtest/RobotBacktest"));
const Metrics = lazy(() => import("../pages/Metrcis"));

export const mainRoutes = [
  {
    path: "/",
    label: "Портфель",
    icon: IconBriefcase,
    element: <Portfolio />,
  },
  {
    path: "/orders",
    label: "Заявки",
    icon: IconColumns,
    element: <Orders />,
  },
  {
    path: "/accounts",
    label: "Аккаунты",
    icon: IconUserCircle,
    element: <Accounts />,
  },
  {
    path: "/robots",
    label: "Образы роботов",
    icon: IconRobot,
    element: <Robots />,
  },
  {
    path: "/workers",
    label: "Мои роботы",
    icon: IconSettings2,
    element: <Workers />,
  },
  {
    path: "/backtest",
    label: "Бэк-тестирование",
    icon: IconHistory,
    element: <Backtest />,
    children: [
      {
        path: "/backtest/:robotId",
        element: <RobotBacktest />,
      },
    ],
  },
  {
    path: "/metrics",
    label: "Метрики инструментов",
    icon: IconTable,
    element: <Metrics />,
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
            children: item.children,
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
