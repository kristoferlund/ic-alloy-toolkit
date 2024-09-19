import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import environment from "vite-plugin-environment";
import viteReact from "@vitejs/plugin-react";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    TanStackRouterVite({
      routesDirectory: "src/frontend/routes",
      generatedRouteTree: "src/frontend/routeTree.gen.ts",
    }),
    viteReact(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
});
