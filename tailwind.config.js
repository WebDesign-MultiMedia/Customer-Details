/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./invoice.html",
    "./index.html",
    "./UPDATES.html",
    "./search.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headings: ["Mozilla Headline", "sans-serif"],
        form: ["Playwrite HU", "cursive"],
        form1: ["Montserrat", "sans-serif"],
        form2: ["Playwrite AU QLD", "cursive"],
        form3: ["Metamorphous", "serif"],
      },
      colors: {
        brand: {
          navy: "#0a1a35",
          navydeep: "#050d1c",
          navylight: "#16305c",
          night: "#241511",
          gold: "#f2b134",
          goldlight: "#ffdd8a",
          coral: "#ef5b5b",
          teal: "#0fa89a",
          cream: "#fdf8ee",
          terracotta: "#c1502e",
          cactus: "#4f8a5b",
          pink: "#e94f9b",
        },
      },
      boxShadow: {
        "depth-sm": "0 2px 8px -2px rgba(5,13,28,0.35), 0 1px 2px rgba(5,13,28,0.25)",
        "depth-md": "0 10px 30px -8px rgba(5,13,28,0.45), 0 4px 10px -4px rgba(5,13,28,0.3)",
        "depth-lg": "0 25px 60px -15px rgba(5,13,28,0.55), 0 10px 20px -8px rgba(5,13,28,0.35)",
        "glow-gold": "0 0 0 1px rgba(242,177,52,0.4), 0 0 24px rgba(242,177,52,0.35)",
        "glow-teal": "0 0 0 1px rgba(15,168,154,0.4), 0 0 24px rgba(15,168,154,0.3)",
        "glow-pink": "0 0 0 1px rgba(233,79,155,0.4), 0 0 24px rgba(233,79,155,0.35)",
        "glow-terracotta": "0 0 0 1px rgba(193,80,46,0.4), 0 0 24px rgba(193,80,46,0.35)",
        paper: "0 1px 1px rgba(0,0,0,0.06), 0 8px 24px -8px rgba(0,0,0,0.25), 0 24px 48px -20px rgba(0,0,0,0.2)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-18px) translateX(6px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px) scale(1)" },
          "50%": { transform: "translateY(20px) translateX(-10px) scale(1.05)" },
        },
        unfold: {
          "0%": { opacity: "0", transform: "rotateX(-12deg) translateY(40px) scale(0.96)" },
          "100%": { opacity: "1", transform: "rotateX(0deg) translateY(0) scale(1)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "floatSlow 11s ease-in-out infinite",
        unfold: "unfold 0.8s cubic-bezier(.2,.7,.2,1) both",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
