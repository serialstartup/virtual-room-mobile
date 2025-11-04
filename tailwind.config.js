/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
        // Guideland Custom Colors
        'virtual': {
          primary: '#ec4899',
          'primary-dark': '#9d174d',
          secondary: '#6b7280',
          surface: '#f9fafb',
          'surface-dark': '#f3f4f6',
          'text-muted': '#6b7280',
          'text-light': '#9ca3af',
        }
      },
    },
  },
  plugins: [],
};
