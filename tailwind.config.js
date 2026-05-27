import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sage palette
        paper:    '#EEF0E8',
        ink:      '#1B2218',
        'ink-2':  '#2F3829',
        accent:   '#4F6B4B',
        'accent-soft': '#E2E8DC',
        hairline: '#D9DDD1',
        muted:    '#7E8475',
        alert:    '#8B4A3A',
        surface:  '#FAFBF6',

        // Primary mapped to accent scale for component compatibility
        primary: {
          50:  '#F0F2EA',
          100: '#E2E8DC',
          200: '#C5D1BB',
          300: '#A8BA9A',
          400: '#8BA37A',
          500: '#6E8B5C',
          600: '#4F6B4B',
          700: '#3E5439',
          800: '#2D3D28',
          900: '#1B2218',
          950: '#0F130E',
        },

        border:     'var(--hairline)',
        input:      'var(--hairline)',
        ring:       '#4F6B4B',
        background: 'var(--paper)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      keyframes: {
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.2s ease-out',
        'fade-in':  'fade-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
