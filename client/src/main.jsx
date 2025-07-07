import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { HashRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </HashRouter>
  </StrictMode>
);
