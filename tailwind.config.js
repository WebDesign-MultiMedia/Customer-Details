/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    "./index.html",
    "./search.html",
    "./src/**/*.{html,js}"],
  theme: {
    extend: {
       fontFamily:{
         headings: ["Mozilla Headline", "sans-serif"],
         form: ["Playwrite HU", "cursive"],
         form1: ["Montserrat", "sans-serif"],
         form2: [ "Playwrite AU QLD", "cursive"],
         form3: ["Metamorphous", "serif"],
      }
    },
  },
  plugins: [],
}

