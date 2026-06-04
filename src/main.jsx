import React from "react";
import { createRoot } from "react-dom/client";
import TomatoSyndicate from "../TomatoSyndicate.jsx";

import "./styles.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Tomato Syndicate service worker registration failed:", error);
    });
  });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TomatoSyndicate />
  </React.StrictMode>
);
