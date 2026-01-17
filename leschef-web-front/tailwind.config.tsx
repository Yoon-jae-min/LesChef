import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",     // App Router 폴더
        "./pages/**/*.{js,ts,jsx,tsx}",   // pages 폴더 (필요시)
        "./components/**/*.{js,ts,jsx,tsx}" // 컴포넌트 폴더
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    '"Pretendard Variable"',
                    'Pretendard',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'system-ui',
                    'Roboto',
                    '"Helvetica Neue"',
                    '"Segoe UI"',
                    '"Apple SD Gothic Neo"',
                    '"Noto Sans KR"',
                    '"Malgun Gothic"',
                    'sans-serif',
                ],
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'logo-entrance': 'logo-entrance 1.5s ease-out',
                'spin-slow': 'spin-slow 3s linear infinite',
                'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
                'bounce-gentle': 'bounce-gentle 2.5s ease-in-out infinite',
                'bounce-wave': 'bounce-wave 1.5s ease-in-out infinite',
                'text-glow': 'text-glow 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(180deg)' },
                },
                'logo-entrance': {
                    '0%': { opacity: '0', transform: 'translateY(-30px) scale(0.8)' },
                    '50%': { opacity: '0.8', transform: 'translateY(-10px) scale(1.05)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                'spin-slow': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                },
                'pulse-gentle': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
                    '50%': { transform: 'scale(1.1)', opacity: '1' },
                },
                'bounce-gentle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'bounce-wave': {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '25%': { transform: 'translateY(-15px) scale(1.1)' },
                    '50%': { transform: 'translateY(-25px) scale(1.2)' },
                    '75%': { transform: 'translateY(-15px) scale(1.1)' },
                },
                'text-glow': {
                    '0%, 100%': { opacity: '0.7', textShadow: '0 0 5px rgba(0,0,0,0.1)' },
                    '50%': { opacity: '1', textShadow: '0 0 10px rgba(255,165,0,0.3)' },
                },
            },
            transitionDelay: {
                '0': '0ms',
                '500': '500ms',
                '1000': '1000ms',
                '2000': '2000ms',
            },
        },
    },
    plugins: [],
}

export default config;