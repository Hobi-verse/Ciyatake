import { defineConfig } from "tailwindcss";

const baseGold = "#b8985b";

export default defineConfig({
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#ffffff",
          100: "#f9f2e6",
          200: "#f2eae0",
          300: "#dcece9",
          400: "#c3dedd",
          500: baseGold,
          600: "#a0824a",
          700: "#8b6e3f",
          800: "#745732",
          900: "#5c4326",
          950: "#3f2d1a",
        },
      },
    },
  },
});
