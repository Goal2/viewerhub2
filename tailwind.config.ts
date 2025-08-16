/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { ink: "#0b0b10" },
      boxShadow: { glow: "0 0 40px 0 rgb(147 51 234 / 0.12)" },
      keyframes: {
        /* halos plus amples */
        floatA: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(48px,-36px,0) scale(1.08)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatB: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-44px,32px,0) scale(1.1)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatC: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(30px,26px,0) scale(1.07)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        floatD: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-28px,-22px,0) scale(1.06)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },

        /* graph */
        dashLoop: {
          "0%": { strokeDashoffset: 2000 },
          "100%": { strokeDashoffset: 0 },
        },
        glowPulse: {
          "0%": { opacity: .35 },
          "50%": { opacity: .8 },
          "100%": { opacity: .35 },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gridDrift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-8px)" },
        },
      },
      animation: {
        floatA: "floatA 32s ease-in-out infinite",
        floatB: "floatB 40s ease-in-out infinite",
        floatC: "floatC 48s ease-in-out infinite",
        floatD: "floatD 56s ease-in-out infinite",
        dashLoop: "dashLoop 6s linear infinite",
        glowPulse: "glowPulse 8s ease-in-out infinite",
        shine: "shine 8s linear infinite",
        gridDrift: "gridDrift 12s linear infinite",
      },
    },
  },
  plugins: [],
};
