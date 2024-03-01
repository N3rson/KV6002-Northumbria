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
        primary: '#eb4034'
      },
    },
  },
  plugins: [],
}