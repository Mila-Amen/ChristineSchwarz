import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // ⚡ Important! Use relative paths in production
  server: {
    host: true, // allows access from LAN
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: "ws", // use 'wss' if HTTPS
      host: "192.168.178.87", // your machine IP
      port: 5173,
    },
  },
  build: {
    outDir: "dist", // default, make sure it matches Express static folder
  },
});
