/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          50:  '#f0faf0',
          100: '#dcf2dc',
          200: '#bae5bb',
          300: '#86d189',
          400: '#4db854',
          500: '#2d9e35',
          600: '#1f7e27',
          700: '#1a6421',
          800: '#174f1d',
          900: '#134119',
        },
        surface: '#f7faf7',
        'surface-2': '#eef5ee',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'elevated': '0 8px 24px 0 rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
};
