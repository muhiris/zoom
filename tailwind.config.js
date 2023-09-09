/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B5CFF",
        secondary: "#2A61BA", // Adding primary color
      },
      textColor: {
        black: "#000000", // Setting black as text color
      },
      screens: {
        mobile: "480px", // Define your custom mobile breakpoint here
      },
    },
  },
  plugins: [ ],
};
