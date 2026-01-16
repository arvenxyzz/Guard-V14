/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0f',
          800: '#0f0f17',
          700: '#14141f',
          600: '#1a1a27',
          500: '#22222f',
          400: '#2a2a3a',
        },
        accent: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
