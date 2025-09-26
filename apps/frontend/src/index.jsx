// REACT
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// REDUX
import { store } from "@/store";
import { Provider } from "react-redux";

// REACT QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// CHAKRA PROVIDER
import { ChakraProvider } from "@chakra-ui/react";
import themes from "@/theme";

// APP COMPONENT
import App from "@/App";

// CSS STYLE
import "@/index.css";

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ChakraProvider theme={themes}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </ChakraProvider>,
);
