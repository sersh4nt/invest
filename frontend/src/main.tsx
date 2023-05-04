import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { routes } from "./data/routes";

const router = createBrowserRouter(routes);
const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={client}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
