/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#050714",
          900: "#080c1e",
          800: "#0d1230",
          700: "#141a42",
          600: "#1e2558",
          500: "#2e3a7a",
          400: "#4a5499",
          300: "#7a84be",
          200: "#b0b7d9",
          100: "#e0e3f2",
          50:  "#f3f4fb",
        },
        violet: {
          900: "#2d0b5a",
          800: "#3d1178",
          700: "#5018a0",
          600: "#6420c8",
          500: "#7c3aed",
          400: "#9b5cf7",
          300: "#bb85f9",
          200: "#dab9fc",
          100: "#f0e5fe",
        },
        cyan: {
          900: "#042e3d",
          800: "#064e65",
          700: "#0a7494",
          600: "#0e9fc2",
          500: "#12c8ee",
          400: "#45d6f4",
          300: "#80e5f8",
          200: "#baf2fc",
          100: "#e5fbfe",
        },
        status: {
          green:  "#22d3a0",
          amber:  "#f59e0b",
          red:    "#ef4444",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body:    ["var(--font-body)",    "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)",    "ui-monospace",  "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.25), transparent)",
        "card-glow":
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(18,200,238,0.08), transparent)",
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up":    "slide-up 0.4s ease-out",
        "glow-pulse":  "glow-pulse 2s ease-in-out infinite",
        "float":       "float 6s ease-in-out infinite",
      },
      keyframes: {
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(124,58,237,0.4)" },
          "50%":       { boxShadow: "0 0 24px rgba(124,58,237,0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        "violet-glow": "0 0 20px rgba(124,58,237,0.35)",
        "cyan-glow":   "0 0 20px rgba(18,200,238,0.3)",
        "card":        "0 4px 24px rgba(5,7,20,0.6)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
