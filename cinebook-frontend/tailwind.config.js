/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFFFF', // White
          dark: '#E5E5E5',
          light: '#FFFFFF',
        },
        purple: {
          DEFAULT: '#8B5CF6', // Purple for auth buttons only
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        dark: {
          DEFAULT: '#0F0F0F',
          lighter: '#1A1A1A',
          light: '#2A2A2A',
        },
        gray: {
          custom: '#3A3A3A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'texture': "url('/texture-bg.png')",
      }
    },
  },
  plugins: [],
}
