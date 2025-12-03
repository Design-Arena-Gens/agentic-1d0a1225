import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#c25d00",
        "alarm-red": "#ff3b30"
      },
      fontFamily: {
        display: ["'DM Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      },
      keyframes: {
        pulseAlarm: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" }
        }
      },
      animation: {
        pulseAlarm: "pulseAlarm 1s infinite ease-in-out"
      }
    }
  },
  plugins: []
};

export default config;
