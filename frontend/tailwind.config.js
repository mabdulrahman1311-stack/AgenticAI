/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#030817',
          sidebar: '#050D1C',
          header: '#050D1C',
          card: '#071426',
          cardHover: '#0b1d36',
          surface: '#0A1930',
          border: 'rgba(58, 130, 246, 0.24)',
          borderSubtle: 'rgba(58, 130, 246, 0.12)',
        },
        primary: {
          blue: '#168BFF',
          cyan: '#00D9FF',
          violet: '#8B5CF6',
          magenta: '#D946EF',
          DEFAULT: '#168BFF',
        },
        accent: {
          blue: '#168BFF',
          cyan: '#00D9FF',
          violet: '#8B5CF6',
          magenta: '#D946EF',
          success: '#00E5B0',
          warning: '#FFB020',
        },
        text: {
          primary: '#F1F5FF',
          secondary: '#91A5C4',
          muted: '#617795',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -4px rgba(22, 139, 255, 0.4)',
        'glow-cyan': '0 0 25px -4px rgba(0, 217, 255, 0.4)',
        'glow-violet': '0 0 25px -4px rgba(139, 92, 246, 0.4)',
        'glow-magenta': '0 0 25px -4px rgba(217, 70, 239, 0.4)',
        'glow-amber': '0 0 25px -4px rgba(255, 176, 32, 0.35)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
