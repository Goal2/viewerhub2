/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b10",
      },
      borderRadius: {
        xl2: "1rem",
      },
      boxShadow: {
        glow: "0 0 40px 0 rgb(147 51 234 / 0.10)",
      },
      keyframes: {
        floatA: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(20px,-12px,0) scale(1.05)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatB: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-18px,10px,0) scale(1.07)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
      },
      animation: {
        floatA: "floatA 28s ease-in-out infinite",
        floatB: "floatB 36s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
