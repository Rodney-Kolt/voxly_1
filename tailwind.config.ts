import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Old Money / Polymarket Dark Palette
        'voxly-bg': '#0A0F1A',           // Deep navy-black background
        'voxly-card': '#111827',         // Card background
        'voxly-border': '#2E3A4A',       // Border color
        'voxly-text': '#F5F5F4',         // Primary text (ivory)
        'voxly-text-muted': '#9CA3AF',  // Secondary text (cool gray)
        'voxly-accent': '#1E3A5F',       // Navy accent (buttons, bars)
        'voxly-accent-hover': '#2B4C7E', // Accent hover
        'voxly-boost': '#B08D57',        // Muted gold/brass
        'voxly-closed': '#5A7D6E',       // Desaturated green
        
        // Keep brand colors for compatibility
        primary: '#1E3A5F',
        'primary-dark': '#0D1F36',
        'primary-light': '#3A5F8F',
        secondary: '#0A0F1A',
        accent: '#B08D57',
        success: '#5A7D6E',
        warning: '#B08D57',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'poll-title-mobile': ['1.1rem', { lineHeight: '1.3', fontWeight: '600' }],
        'poll-title-desktop': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1E3A5F 0%, #2B4C7E 100%)',
      },
      boxShadow: {
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.2)',
      },
      spacing: {
        '18': '4.5rem',
      },
      transitionProperty: {
        'transform-color': 'transform, color, border-color, box-shadow',
      },
    },
  },
  plugins: [],
}
export default config
