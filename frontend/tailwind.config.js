/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#c7c6c6',
        'surface-dim': '#121414',
        'surface-container': '#1f2020',
        'surface-container-low': '#1b1c1c',
        'surface-container-high': '#292a2a',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
