/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a1a',    // Dark background color
        'dark-text': '#e0e0e0',  // Light text color
        'dark-element-bg': '#2a2a2a', // Background for elements with bg-white class
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease forwards',
      },
    },
  },
  plugins: [],
};
