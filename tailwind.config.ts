
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2978FF', // Electric Blue
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#FF8C42', // Sunset Orange
					foreground: '#FFFFFF'
				},
				success: {
					DEFAULT: '#3EE0B7', // Mint Green
					foreground: '#FFFFFF'
				},
				warning: {
					DEFAULT: '#FFC947', // Amber Yellow
					foreground: '#2E2E2E'
				},
				error: {
					DEFAULT: '#FF4C4C', // Coral Red
					foreground: '#FFFFFF'
				},
				neutral: {
					dark: '#2E2E2E', // Charcoal Gray
					light: '#F7F7F7' // Soft Ivory
				},
				channel: {
					email: '#74C0FC', // Sky Blue
					linkedin: '#127E8A', // Deep Teal
					sms: '#B67FFF', // Lilac Purple
					calls: '#FFF35C' // Sunshine Yellow
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"pulse-opacity": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
				"spinner": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-opacity": "pulse-opacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"spinner": "spinner 1s linear infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
