/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A2B4C", // Indigo Blue Primary Header & Sidebar
          dark: "#0F1A30",
          light: "#283E66",
          700: "#142340",
        },
        accent: {
          DEFAULT: "#FF6B35", // Vibrant Coral Orange Accent (NO RED)
          hover: "#E85A24",
          light: "#FFF0EB",
          soft: "#FFDCD1",
        },
      },
      fontFamily: {
        // Body / default → Montserrat
        sans: ["'Montserrat'", "sans-serif"],
        // Heading → Playfair Display  (used via font-poppins throughout headings/nav)
        poppins: ["'Playfair Display'", "Georgia", "serif"],
        // Body descriptions → Montserrat  (used via font-inter throughout descriptions)
        inter: ["'Montserrat'", "sans-serif"],
        // Albert Sans alias → Montserrat
        "albert-sans": ["'Montserrat'", "sans-serif"],
        // Geograph (keep as fallback, used rarely)
        geograph: ["'geograph-regular'", "Geograph", "'Montserrat'", "sans-serif"],
        "geograph-regular": ["'geograph-regular'", "Geograph", "'Montserrat'", "sans-serif"],
        // Explicit utilities
        playfair: ["'Playfair Display'", "Georgia", "serif"],
        montserrat: ["'Montserrat'", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        fadeIn: "fadeIn 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
