/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#070A08',
        surface: '#111713',
        primary: '#B6FF4A',
        secondary: '#00D68F',
        ink: '#F5F7F5',
        muted: '#8A948D',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(182,255,74,0.25)',
        glowSoft: '0 0 60px rgba(0,214,143,0.15)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        blink: { '0%,50%': { opacity: '1' }, '51%,100%': { opacity: '0' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blink: 'blink 1s steps(1) infinite',
        scan: 'scan 6s linear infinite',
      },
    },
  },
  plugins: [],
}
