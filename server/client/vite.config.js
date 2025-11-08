import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows access from LAN
    port: 5173,
    strictPort: true, 
    hmr: {
      protocol: "ws", // use 'wss' if HTTPS
      host: "192.168.178.87", // or your machine IP
      port: 5173,
    },
  },
});
