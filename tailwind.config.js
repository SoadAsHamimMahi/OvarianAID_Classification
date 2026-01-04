export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0F766E",
                    soft: "#E0F2F1"
                },
                bg: "#F8FAFC",
                surface: "#FFFFFF",
                border: "#E2E8F0",
                muted: {
                    DEFAULT: "#6B7280",
                    light: "#9CA3AF"
                },
                success: "#16A34A",
                warning: "#EA580C",
                error: "#DC2626",
                info: "#0EA5E9"
            }
        }
    },
    plugins: []
}
