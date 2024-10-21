/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeSlideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite", // Slower bounce
        fadeSlideDown: "fadeSlideDown 1s ease-out",
      },
    },
  },
  plugins: [],
};
