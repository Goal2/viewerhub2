/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { ink: "#0b0b10" },
      boxShadow: { glow: "0 0 40px 0 rgb(147 51 234 / 0.10)" },
      keyframes: {
        floatA: {
          "0%":   { transform: "translate3d(0,0,0) scale(1)" },
          "50%":  { transform: "translate3d(14px,-10px,0) scale(1.03)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatB: {
          "0%":   { transform: "translate3d(0,0,0) scale(1)" },
          "50%":  { transform: "translate3d(-12px,8px,0) scale(1.035)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatC: {
          "0%":   { transform: "translate3d(0,0,0) scale(1)" },
          "50%":  { transform: "translate3d(10px,6px,0) scale(1.02)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
      },
      animation: {
        floatA: "floatA 45s ease-in-out infinite",
        floatB: "floatB 52s ease-in-out infinite",
        floatC: "floatC 60s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
