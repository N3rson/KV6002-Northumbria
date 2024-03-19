/** @type {import('tailwindcss').Config} */
 
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '250px'
      },
      colors: {
        steelBlue: '#4682B4',
        primary: '#edf4ff',
        secondary: '#fcf0ed',
        colour1: '#7da6f0',
        colour2: '#faaf98',
        seeAllHover: '#fcbfac',
        bookHover: "#5f92ed",
      },
    },
    borderRadius: {
      lg: '0.5rem',
      xlg: '2rem',
      full: '9999px'
    },
    boxShadow: {
      middle: '0 0px 15px -3px rgb(0 0 0 / 0.2)',
    }
  },
  plugins: [],
}