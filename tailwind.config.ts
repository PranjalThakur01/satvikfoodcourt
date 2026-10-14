import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./data/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#17231d", cream: "#f7f5ed", leaf: "#55794e", tomato: "#df6e4e", butter: "#e9bd68" }, fontFamily: { sans: ["var(--font-body)"], display: ["var(--font-display)"] } } },
  plugins: []
};
export default config;
