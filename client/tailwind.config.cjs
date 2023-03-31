/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {  
      colors: {
        'primary': '#DDA300',
        'primary-purple': '#750F6D'
      }
    },
  },
  plugins: [],
}
