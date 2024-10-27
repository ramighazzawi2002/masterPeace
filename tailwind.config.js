module.exports = {
  theme: {
    extend: {
      colors: {
        customBrown: "#795548",
        customGreen: "#4CAF50",
        customYellow: "#F9A825", // Add this if not already present
        sand: {
          100: "#F5F5DC", // Light sand color for backgrounds
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
};
