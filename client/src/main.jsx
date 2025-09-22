import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { HashRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { CartProvider } from "../src/context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <CartProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CartProvider>
    </HashRouter>
  </StrictMode>
);
