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
        primary: '#e1ebfc',
        secondary: '#fcd9d2',
        colour1: '#A2BEEF',
        colour2: '#FBB2A3',
      },
    },
    borderRadius: {
      lg: '0.5rem',
      xlg: '2rem',
    },
    boxShadow: {
      middle: '0 0px 15px -3px rgb(0 0 0 / 0.2)',
    }
  },
  plugins: [],
}