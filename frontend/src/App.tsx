import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WithAxios } from "./context/WithAxios";
import { routes } from "./data/routes";

const router = createBrowserRouter(routes);
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WithAxios>
        <QueryClientProvider client={client}>
          <MantineProvider>
            <RouterProvider router={router} />
          </MantineProvider>
        </QueryClientProvider>
      </WithAxios>
    </AuthProvider>
  );
};

export default App;
