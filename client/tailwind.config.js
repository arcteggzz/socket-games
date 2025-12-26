/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7f56d9',
      },
      maxWidth: {
        screen: '480px',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
}
