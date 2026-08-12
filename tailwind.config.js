/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0b0c0e",
          charcoal: "#14161b",
          card: "#1b1e25",
          brass: "#c59b27",
          "brass-light": "#e5c365",
          "brass-dark": "#967216",
          champagne: "#f3e8cf",
          slate: "#f9f8f5",
          muted: "#f0ece1",
          border: "#e5e0d3",
          "border-dark": "#2a2e38",
          text: "#1c1e22",
          "text-muted": "#6b7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02)",
        elevated: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        floating: "0 20px 40px -10px rgba(0, 0, 0, 0.25)",
        gold: "0 0 25px rgba(197, 155, 39, 0.25)",
      },
    },
  },
  plugins: [],
};
