import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "./App.css";
import App from "./App";

const themeKey = "theme_guest";
const saved = localStorage.getItem(themeKey) || "light";
document.documentElement.setAttribute("data-theme", saved);
localStorage.removeItem("light");

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);