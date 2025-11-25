import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                principal: "var(--principal)",
                secundario: "var(--secundario)",
                terciario: "var(--terciario)",
                white: "var(--white)",
                azul: "var(--azul)",
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                fredoka: ["var(--font-fredoka)", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;