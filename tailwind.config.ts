import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          "50": "#e8f5ff",
          "100": "#d5ecff",
          "200": "#b3daff",
          "300": "#86c0ff",
          "400": "#5796ff",
          "500": "#306dff",
          "600": "#0d3dff",
          "700": "#C04021",
          "800": "#072fcc",
          "900": "#10309f",
          "950": "#0a1b5c",
        },
        paulblau: "#7678bf",
        woit: "#f7f1f3",
      },
    },
  },
  plugins: [],
};
export default config;
