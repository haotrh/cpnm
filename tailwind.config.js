module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './layouts/*.{js,ts,jsx,tsx}', './components/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'dark': '#1e1e1e',
      }
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      borderWidth: ['hover']
    },
  },
  plugins: [],
}
