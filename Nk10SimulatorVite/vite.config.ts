import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/Nk10simulator/",
});
// https://vitejs.dev/config/
// https://tailwindcss.com/docs/guides/vite
// https://tailwindcss.com/docs/installation
// https://tailwindcss.com/docs/installation#using-tailwind-via-cdn