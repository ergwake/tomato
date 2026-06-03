import React from "react";
import { createRoot } from "react-dom/client";
import TomatoSyndicate from "../TomatoSyndicate.jsx";

import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TomatoSyndicate />
  </React.StrictMode>
);
