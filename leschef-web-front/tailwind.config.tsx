import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",     // App Router 폴더
        "./pages/**/*.{js,ts,jsx,tsx}",   // pages 폴더 (필요시)
        "./components/**/*.{js,ts,jsx,tsx}" // 컴포넌트 폴더
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

export default config;