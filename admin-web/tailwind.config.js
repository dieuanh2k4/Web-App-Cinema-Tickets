/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15151f',
        secondary: '#1e1e2e',
        accent: '#6366f1',
      },
    },
  },
  plugins: [],
}
