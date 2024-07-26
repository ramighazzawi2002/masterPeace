/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        test: "#000",
        customRed: "#be2a2a",
        customGreen: "#8BC34A",
        customYellow: "#FFF8E1",
        customBrown: "#5D4037",
        customMuted: "#D3D3D3",
        customMutedForeground: "#A9A9A9",
        customGreen2: "#6B8E23",
        customGrey: "#8D8D8D",
      },
    },
  },
  plugins: [],
});

// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
//   theme: {
//     extend: {
//       colors: { customRed: "#D32F2F" },
//     },
//   },
//   plugins: [],
// };
