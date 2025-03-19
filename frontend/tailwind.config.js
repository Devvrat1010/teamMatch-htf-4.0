/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                bricolage: ["Bricolage Grotesque", "sans-serif"],
            },
            colors: {
                screenBG: "#efedff",
                textHeading: "#fdb461",
                textBody: "#ffce97",
                textButton: "#ffc88a",
                primary: "#1e1e2f",
                secondary: "#403950",
                tertiary: "#665672",
                quaternary: "#917595",
                quinary: "#bf95b7",
                senary: "#ffc88a",
                genericSecondary: "#593957",
                genericTertiary: "#9f546a",
                genericQuaternary: "#dc7b69",
            }
        },
    },
    plugins: [],
}