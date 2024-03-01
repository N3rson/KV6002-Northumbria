/** @type {import('tailwindcss').Config} */
 
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steelBlue: '#4682B4',
        primary: '#e1ebfc',
        secondary: '#fcd9d2'
      },
    },
    borderRadius: {
      'xlg': '2rem',
    }
  },
  plugins: [],
}