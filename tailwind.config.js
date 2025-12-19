/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: 'rgb(var(--tw-background) / <alpha-value>)',
        foreground: 'rgb(var(--tw-foreground) / <alpha-value>)',
        card: 'rgb(var(--tw-card) / <alpha-value>)',
        primary: 'rgb(var(--tw-primary) / <alpha-value>)',
        secondary: 'rgb(var(--tw-secondary) / <alpha-value>)',
        destructive: 'rgb(var(--tw-destructive) / <alpha-value>)',
        border: 'rgb(var(--tw-border) / <alpha-value>)',
        muted: 'rgb(var(--tw-muted) / <alpha-value>)',
        amro: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          900: '#134e4a',
          dark: '#0f172a',
          light: '#f8fafc',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    }
  },
  plugins: [],
}
