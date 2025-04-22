/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        silver: '#c0c0c0',
        'silver-light': '#e0e0e0',
        'silver-dark': '#a0a0a0',
      },
    },
  },
  plugins: [],
}

