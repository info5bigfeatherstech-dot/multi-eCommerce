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
        // Subheadings, descriptions & body → Montreal (PP Neue Montreal)
        sans: ["'Neue Montreal'", "'PP Neue Montreal'", "'Montreal'", "'Montserrat'", "'Inter'", "sans-serif"],
        montreal: ["'Neue Montreal'", "'PP Neue Montreal'", "'Montreal'", "'Montserrat'", "'Inter'", "sans-serif"],
        subheading: ["'Neue Montreal'", "'PP Neue Montreal'", "'Montreal'", "'Montserrat'", "'Inter'", "sans-serif"],
        inter: ["'Neue Montreal'", "'PP Neue Montreal'", "'Montreal'", "'Montserrat'", "'Inter'", "sans-serif"],
        "albert-sans": ["'Neue Montreal'", "'PP Neue Montreal'", "'Montreal'", "'Montserrat'", "sans-serif"],
        geograph: ["'Neue Montreal'", "'PP Neue Montreal'", "'Montreal'", "'Montserrat'", "sans-serif"],
        "geograph-regular": ["'Neue Montreal'", "'PP Neue Montreal'", "'Montreal'", "'Montserrat'", "sans-serif"],

        // Headings → Modern Plus Jakarta Sans / Outfit
        heading: ["'Plus Jakarta Sans'", "'Outfit'", "'Poppins'", "sans-serif"],
        poppins: ["'Plus Jakarta Sans'", "'Outfit'", "'Poppins'", "sans-serif"],
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
        outfit: ["'Outfit'", "sans-serif"],
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
