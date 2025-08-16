extend: {
  colors: { ink: "#0b0b10" },
  boxShadow: { glow: "0 0 40px 0 rgb(147 51 234 / 0.12)" },

  keyframes: {
    /* halos – amplitude + vitesse légèrement accrues */
    floatA: {
      "0%": { transform: "translate3d(0,0,0) scale(1)" },
      "50%": { transform: "translate3d(64px,-48px,0) scale(1.10)" },
      "100%": { transform: "translate3d(0,0,0) scale(1)" },
    },
    floatB: {
      "0%": { transform: "translate3d(0,0,0) scale(1)" },
      "50%": { transform: "translate3d(-58px,44px,0) scale(1.12)" },
      "100%": { transform: "translate3d(0,0,0) scale(1)" },
    },
    floatC: {
      "0%": { transform: "translate3d(0,0,0) scale(1)" },
      "50%": { transform: "translate3d(42px,34px,0) scale(1.09)" },
      "100%": { transform: "translate3d(0,0,0) scale(1)" },
    },
    floatD: {
      "0%": { transform: "translate3d(0,0,0) scale(1)" },
      "50%": { transform: "translate3d(-36px,-30px,0) scale(1.08)" },
      "100%": { transform: "translate3d(0,0,0) scale(1)" },
    },

    /* graph – effets doux uniquement */
    glowPulse: {
      "0%":   { opacity: .22 },
      "50%":  { opacity: .38 },
      "100%": { opacity: .22 },
    },
  },

  animation: {
    floatA: "floatA 34s ease-in-out infinite",
    floatB: "floatB 42s ease-in-out infinite",
    floatC: "floatC 50s ease-in-out infinite",
    floatD: "floatD 58s ease-in-out infinite",
    glowPulse: "glowPulse 12s ease-in-out infinite",
  },
}
