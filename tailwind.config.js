/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#12151c',
        panel: {
          DEFAULT: '#191e28',
          hover: '#222936',
          active: '#2b3342',
        },
        border: {
          subtle: '#2a303c',
          strong: '#3b4455',
        },
        paper: {
          DEFAULT: '#f6f3ec',
          line: '#e2ddce',
          ink: '#201f1a',
          soft: '#55524a',
        },
        amber: {
          brand: '#e3a448',
          dim: '#2f2516',
        },
        teal: {
          accent: '#59a89c',
          dim: '#182a27',
        },
        plum: {
          accent: '#a673a8',
          dim: '#281d2a',
        },
        red: {
          accent: '#e06c75',
          dim: '#2b171a',
        },
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
        serif: ['Source Serif 4', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
