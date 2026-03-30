import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/main.css';
import { TripProvider } from "./context/TripContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TripProvider>
      <App />
    </TripProvider>
  </React.StrictMode>
);