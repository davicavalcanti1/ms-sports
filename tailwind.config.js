/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#d4af35", // Gold from Admin Command Center
                secondary: "#1a1a1a", // Dark background
                accent: "#ffffff",
                "gold-glow": "#d4af35", // For potential glow effects
            },
            fontFamily: {
                sans: ['"Space Grotesk"', 'sans-serif'],
                orbitron: ['"Orbitron"', 'sans-serif'], // Keep Orbitron if needed for headers
            },
            boxShadow: {
                'gold': '0 0 10px rgba(212, 175, 53, 0.5)',
                'gold-lg': '0 0 20px rgba(212, 175, 53, 0.3)',
            }
        },
    },
    plugins: [],
}
