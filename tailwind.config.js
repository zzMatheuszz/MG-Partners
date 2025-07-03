/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Isso diz ao Tailwind para escanear todos os arquivos JS/JSX na pasta src
    "./public/index.html", // E também o seu index.html
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'playfair-display': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}