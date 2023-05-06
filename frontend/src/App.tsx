import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./data/routes";

const router = createBrowserRouter(routes);
const client = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={client}>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
