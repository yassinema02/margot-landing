import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#ECEAE5",
        surface: "#F6F4EF",
        warm: "#DDDAD3",
        warm2: "#CECABF",
        ink: "#2D3A33",
        ink2: "#4D5852",
        ink3: "#5C6660",
        ink4: "#B0B5B0",
        ink5: "#D8D6D0",
        walnut: "#5C6B5E",
        peach: "#B85133",
        sage: "#5F7560",
        rust: "#A0421F",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter2: "-0.04em",
        tight2: "-0.035em",
        tight3: "-0.03em",
        tight4: "-0.025em",
        tight5: "-0.02em",
        tight6: "-0.015em",
        tight7: "-0.005em",
        widish: "0.14em",
        wider2: "0.16em",
      },
    },
  },
  plugins: [],
};

export default config;
