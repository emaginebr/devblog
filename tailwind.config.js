/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/nauth-react/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/nnews-react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Lexend', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dotnet: {
          purple: '#512BD4',
          'purple-light': '#7B5CF0',
          'purple-dark': '#3B1F9E',
          cyan: '#00D4AA',
          'cyan-dark': '#00A88A',
        },
        surface: {
          0: '#08080c',
          1: '#111118',
          2: '#1a1a24',
          3: '#22222e',
          4: '#2a2a38',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
