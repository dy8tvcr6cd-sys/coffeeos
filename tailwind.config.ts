import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          background: "#F7F4EF",
          card: "#FFFFFF",
          primary: "#181818",
          secondary: "#6B625A",
          accent: "#C8A45D",
          border: "#E7DED2",
          dark: "#111111"
        }
      },
      boxShadow: {
        soft: "0 18px 44px rgba(17, 17, 17, 0.08)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;

