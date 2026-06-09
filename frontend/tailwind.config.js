/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#6b6375',
        'text-h': '#08060d',
        'bg': '#fff',
        'border': '#e5e4e7',
        'code-bg': '#f4f3ec',
        'accent': '#aa3bff',
        'accent-bg': 'rgba(170, 59, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
