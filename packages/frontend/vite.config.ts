import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tsConfigPaths(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true,

        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("error", err);
          });
          proxy.on("proxyReq", (_, req) => {
            console.log("Request sent to target:", req.method, req.url);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Response received from target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
