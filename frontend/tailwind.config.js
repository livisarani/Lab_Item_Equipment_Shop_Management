export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helveticaneueltstd Roman"', '"Inter"', 'sans-serif'],
        display: ['"Helveticaneueltstd Bd"', '"Inter"', 'sans-serif'],
        medium: ['"Helveticaneueltstd Md"', '"Inter"', 'sans-serif'],
      },
      colors: {
        scan: {
          bg: '#000000',
          surface: '#090909',
          surface2: '#131313',
          primary: '#0e97b0',
          primaryLight: '#27c2d2',
          primaryExtraLight: '#3dd4e3',
          primaryDark: '#0e4e65',
          secondary: '#aa4266',
          bioGreen: '#0f9b40',
          bioGreenLight: '#27b064',
          muted: '#b0b0b0',
          borderDark: '#212121',
          borderLight: '#d1d1d1',
          cardLight: '#d4d4d4',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#3dd4e3',
          500: '#27c2d2',
          600: '#0e97b0',
          700: '#007593',
          800: '#0e4e65',
          900: '#082f3d',
        }
      },
      borderRadius: {
        'btn': '20px',
        'card': '32px',
        'card-lg': '48px',
      }
    },
  },
  plugins: [],
}
