/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["OutfitRegular"], // default font
        sans: ["OutfitRegular"],
      },
      // fontFamily: {
      //   sans: ['Outfit_400Regular'],
      //   outfit: ['Outfit_400Regular'],
      //   'outfit-medium': ['Outfit_500Medium'],
      //   'outfit-bold': ['Outfit_700Bold'],
      // },
      colors: {
        // Guideland Custom Colors
        virtual: {
          "primary-light": "#f9a8d4",
          primary: "#ec4899",
          "primary-dark": "#9d174d",
          secondary: "#6b7280",
          surface: "#f9fafb",
          "surface-dark": "#f3f4f6",
          "text-muted": "#6b7280",
          "text-muted-dark": "#262626",
          "text-light": "#9ca3af",
        },
      },
    },
  },
  plugins: [],
};
