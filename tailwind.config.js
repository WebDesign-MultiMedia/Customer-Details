/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    "./invoice.html","./index.html", "./UPDATES.html",
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
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }
      'body': 'red',

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}

