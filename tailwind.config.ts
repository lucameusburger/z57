import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        foreground: "rgb(var(--foreground-rgb) / <alpha-value>)",
        line: "var(--line)",
        lime: "#defe51",
        leaf: "#65d87d",
        blue: {
          "50": "#e8f5ff",
          "100": "#d5ecff",
          "200": "#b3daff",
          "300": "#86c0ff",
          "400": "#5796ff",
          "500": "#306dff",
          "600": "#0d3dff",
          "700": "#0736fe",
          "800": "#072fcc",
          "900": "#10309f",
          "950": "#0a1b5c",
        },
        paulblau: "#7678bf",
        woit: "#f7f1f3",
        stella: "#C04021",
      },
      borderColor: {
        DEFAULT: "var(--line)",
      },
      backgroundImage: {
        glass: "url('./images/group-glass.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;
