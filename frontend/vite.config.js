import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api/patients": {
        target: "http://127.0.0.1:4001",
        changeOrigin: true,
      },
      "/api/medications": {
        target: "http://127.0.0.1:4002",
        changeOrigin: true,
      },
      "/api/events": {
        target: "http://127.0.0.1:4003",
        changeOrigin: true,
      },
    },
  },
});
