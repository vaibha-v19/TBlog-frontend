const path = require('path');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: {
          '50': '#f0faff',
          '100': '#e0f7fa',
        },
        cyan: {
          '50': '#dffbff',
        },
        primary: '#01b0cb',
      },
      borderRadius: {
        'lg': '8px',
      },
      backgroundImage: {
        'signup-bg-img': "url('/src/assets/images/signup-bg-image.webp')", // Define custom background image
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
