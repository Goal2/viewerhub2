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
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(24px,-18px,0) scale(1.05)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatB: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-20px,16px,0) scale(1.06)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatC: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(16px,12px,0) scale(1.04)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        dash: {
          "0%": { strokeDashoffset: 1000 },
          "100%": { strokeDashoffset: 0 },
        },
        glowPulse: {
          "0%": { opacity: .35 },
          "50%": { opacity: .7 },
          "100%": { opacity: .35 },
        },
      },
      animation: {
        floatA: "floatA 36s ease-in-out infinite",
        floatB: "floatB 44s ease-in-out infinite",
        floatC: "floatC 52s ease-in-out infinite",
        dash: "dash 2.4s ease-out forwards",
        glowPulse: "glowPulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
