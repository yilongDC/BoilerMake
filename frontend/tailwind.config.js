/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        'tiny-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'tiny-bounce 2.5s ease-in-out infinite',
      },
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

