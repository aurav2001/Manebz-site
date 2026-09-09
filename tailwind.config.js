/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#05070E',
          card: '#0B0F19',
          cardHover: '#111827',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(0, 242, 254, 0.3)',
          cyan: '#00F2FE',
          blue: '#4FACFE',
          emerald: '#10B981',
          purple: '#8B5CF6',
          gold: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'glow-spin': 'glow-spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'beam': 'beam 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-1.5deg)' },
        },
        'glow-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        beam: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 242, 254, 0.35)',
        'blue-glow': '0 0 30px -5px rgba(79, 172, 254, 0.35)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'card-glow': '0 10px 40px -10px rgba(0, 242, 254, 0.15)',
      }
    },
  },
  plugins: [],
}
