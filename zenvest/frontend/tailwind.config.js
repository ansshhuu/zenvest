/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zenvest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#2563eb', // branding blue
          600: '#1d4ed8',
          700: '#1e40af',
        }
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
