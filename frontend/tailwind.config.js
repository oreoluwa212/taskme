/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-custom":
          "linear-gradient(90deg, #0034EE 0%, #142667 50%, #0A1B32 100%)",
      },
      textColor: {
        "gradient-custom": "transparent",
      },
      boxShadow: {
        "custom-xl":
          "0 5px 5px 1px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        primary: "#0034EE",
        secondary: "#00114F",
        bg: "#F9FAFB",
        blueBg: "#CCD6FC",
        dashboardBg: "#FAFAFA",
        grey: "#1D2939",
        dark: "#0A1B32",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        bricolageGrotesque: ["Bricolage Grotesque", "sans-serif"],
      },
      screens: {
        xs: "480px",
        mds: "600px",
        md: "800px",
        lgss: "976px",
        lg: "1000px",
        xxl: "1300px",
      },
    },
  },
  variants: {},
  plugins: [],
};
