/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          blue: {
            50: '#eef6ff',
            100: '#d9ebff',
            500: '#3b82f6',
            600: '#0065CC', // Màu xanh thương hiệu Bách Khoa
            700: '#0052a3',
            900: '#003366',
          }
        }
      },
    },
    plugins: [],
  };