
import type { Config } from 'tailwindcss'
const config: Config = {
    darkMode: 'class',
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          bg: "#0b1220",
          card: "#0f1724",
          border: "#1f2937",
          text: "#e6eef8",
          sub: "#9aa6b2",
        }
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        "2xl": "1rem"
      }
    }
  },
  plugins: [],
}
export default config;
