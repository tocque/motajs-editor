import React from "react";
import ReactDOM from "react-dom/client";
import Workbench from "./workbench/index.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Workbench />
    </QueryClientProvider>
  </React.StrictMode>,
);
