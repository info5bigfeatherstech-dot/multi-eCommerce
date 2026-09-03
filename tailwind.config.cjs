/** @type {import('tailwindcss').Config} */
module.exports = {
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
        sans: ["'geograph-regular'", "Geograph", "Albert Sans", "sans-serif"],
        geograph: ["'geograph-regular'", "Geograph", "sans-serif"],
        "geograph-regular": ["'geograph-regular'", "Geograph", "sans-serif"],
        "albert-sans": ["'geograph-regular'", "Geograph", "Albert Sans", "sans-serif"],
        poppins: ["'geograph-regular'", "Geograph", "Poppins", "sans-serif"],
        inter: ["'geograph-regular'", "Geograph", "Inter", "sans-serif"],
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
