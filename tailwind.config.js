/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#060810',
        surface: '#0d1117',
        panel: '#111827',
        card: '#161d2e',
        border: '#1e2d45',
        border2: '#253352',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        danger: '#f43f5e',
        warning: '#f59e0b',
        success: '#10b981',
        orange: '#f97316',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
