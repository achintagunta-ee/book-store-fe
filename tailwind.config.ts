import type { Config } from "tailwindcss";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "rgb(var(--color-primary) / <alpha-value>)",
				"background-light":
					"rgb(var(--color-background-light) / <alpha-value>)",
				"background-dark": "rgb(var(--color-background-dark) / <alpha-value>)",
				"card-border": "rgb(var(--color-card-border) / <alpha-value>)",
				"secondary-link": "rgb(var(--color-secondary-link) / <alpha-value>)",
				"text-main": "rgb(var(--color-text-main) / <alpha-value>)",
				"text-main-dark": "rgb(var(--color-text-main-dark) / <alpha-value>)",
				"text-light": "rgb(var(--color-text-light) / <alpha-value>)",
			},
			fontFamily: {
				display: ["Merriweather", "serif"],
				body: ["Open Sans", "sans-serif"],
			},
			borderRadius: {
				DEFAULT: "0.5rem",
				lg: "0.75rem",
				xl: "1rem",
			},
			boxShadow: {
				soft: "0 10px 25px -5px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
			},
		},
	},
	plugins: [],
} satisfies Config;
