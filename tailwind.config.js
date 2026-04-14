/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        ink: {
          950: '#07080f',
          900: '#0d0f1a',
          800: '#141624',
          700: '#1d2035',
          600: '#252847',
          500: '#363a5e',
        },
        cyan: {
          DEFAULT: '#00e5cc',
          400: '#00e5cc',
          300: '#33edd6',
          200: '#66f2e0',
          100: '#b3f8ef',
        },
        coral: {
          DEFAULT: '#ff6b6b',
          400: '#ff6b6b',
          300: '#ff8e8e',
        },
        amber: {
          DEFAULT: '#ffbe0b',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(0, 229, 204, 0.18)',
        'glow-lg': '0 0 48px rgba(0, 229, 204, 0.25)',
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'grid-ink': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(0,229,204,0.15)' },
          '50%': { boxShadow: '0 0 32px rgba(0,229,204,0.35)' },
        },
      },
    },
  },
  plugins: [],
}
