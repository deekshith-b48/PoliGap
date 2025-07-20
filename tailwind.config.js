/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF007F',
        'neon-green': '#00FF7F',
        'neon-blue': '#00B7EB',
        'neon-yellow': '#FFFF00',
        'neon-red': '#FF4040',
      },
      boxShadow: {
        'neo': '8px 8px 0px rgba(0, 0, 0, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
