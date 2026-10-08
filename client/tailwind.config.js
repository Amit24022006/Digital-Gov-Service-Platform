/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          primary: '#1e3a8a', // Deep Bharat Navy
          primaryHover: '#172554',
          accent: '#ea580c', // Indian saffron / warm orange
          emerald: '#059669', // Verification green
          amber: '#d97706',
          slate: '#334155',
          light: '#f8fafc',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
