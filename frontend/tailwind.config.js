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
        primary: '#6366f1',
        secondary: '#a855f7',
        background: '#121414',
        surface: '#121414',
        'on-surface': '#e3e2e2',
        'on-surface-variant': '#94a3b8',
        'surface-dim': '#121414',
        'surface-container': '#1f2020',
        'surface-container-low': '#1b1c1c',
        'surface-container-high': '#292a2a',
        'surface-container-lowest': '#0B0E14',
        'on-primary': '#ffffff',
        'outline-variant': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'label-caps': ['0.75rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '0.1em' }],
      },
      fontWeight: {
        'h1': '800',
        'h3': '600',
      }
    },
  },
  plugins: [],
}
