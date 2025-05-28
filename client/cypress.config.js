import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // ✅ Your Vite dev server URL
    setupNodeEvents(on, config) {
      // You can add plugins or custom events here if needed
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
