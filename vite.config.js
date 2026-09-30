import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/free-tools-hub-v1/",
  plugins: [react()],
});