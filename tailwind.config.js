/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#080c14',
          900: '#0d131f',
          850: '#111927',
          800: '#172234',
          700: '#22324b',
          600: '#344b6f',
          500: '#4e6b9c',
          400: '#7391c8',
        },
        hazard: {
          red: '#ff3344',
          amber: '#f59e0b',
          yellow: '#fbbf24',
          green: '#10b981',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beacon': 'beacon 2s infinite',
      },
      keyframes: {
        beacon: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.08)' },
        }
      }
    },
  },
  plugins: [],
}
