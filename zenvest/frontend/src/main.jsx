import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Import all original CSS files - no changes to styles
import "./styles/tailwind.css";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
