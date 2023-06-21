/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {},
        colors: {
            'light-blue': '#1576A4',
            blue: {
                100: '#A6E8FA',
                200: '#90CFEE',
                300: '#7AB6E1',
                400: '#649ECA',
                500: '#4A74A4',
                600: '#325A84',
                700: '#192E52',
                DEFAULT: '#192E52',
                800: '#111F3C',
                900: '#0D1D37',
            },
            yellow: '#FFC800',
            red: '#FF4C4C',
            green: '#56B4A0',
            slate: colors.slate,
            gray: colors.gray,
            black: colors.black,
            white: colors.white,
        },
    },
    plugins: [
        function ({ addUtilities, theme }) {
            function extractColorVars(colorObj, colorGroup = '') {
                return Object.keys(colorObj).reduce((vars, colorKey) => {
                    const value = colorObj[colorKey];
                    const cssVariable = colorKey === 'DEFAULT' ? `--color${colorGroup}` : `--color${colorGroup}-${colorKey}`;

                    const newVars = typeof value === 'string' ? { [cssVariable]: value } : extractColorVars(value, `-${colorKey}`);

                    return { ...vars, ...newVars };
                }, {});
            }

            addUtilities({
                ':root': extractColorVars(theme('colors')),
            });
        },
    ],
};
