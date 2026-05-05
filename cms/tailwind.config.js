/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#151312',
        'accent-lime': '#c5ff41',
        'accent-orange': '#f46c38',
        'gray-mid': '#998f8f',
        'gray-dark': '#6a6b6e',
        card: '#1c1a19',
        sidebar: '#111010',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
