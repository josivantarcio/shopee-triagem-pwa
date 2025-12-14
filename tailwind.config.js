/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FF6B35',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#2C3E50',
          foreground: '#ffffff'
        },
        success: {
          DEFAULT: '#27AE60',
          foreground: '#ffffff'
        },
        warning: {
          DEFAULT: '#F39C12',
          foreground: '#ffffff'
        },
        destructive: {
          DEFAULT: '#E74C3C',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};