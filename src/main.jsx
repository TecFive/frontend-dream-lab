import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReservaProvider } from "./hooks/useLAB";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReservaProvider>
      <App />
    </ReservaProvider>
  </React.StrictMode>
);
