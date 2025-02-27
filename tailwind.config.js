/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#00B865',
        secondary: '#1B1B3A'
      },
      fontFamily: {
        'sora-regular': ['Sora-Regular'],
        'sora-medium': ['Sora-Medium'],
        'sora-semibold': ['Sora-SemiBold'], 
        'sora-bold': ['Sora-Bold'],
        'sora-extrabold': ['Sora-ExtraBold'],
        'sora-thin': ['Sora-Thin'],
        'sora-light': ['Sora-Light'],
        'sora-extralight': ['Sora-ExtraLight']
      }
    },
  },
  plugins: [],
}