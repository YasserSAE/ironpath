import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        iron: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d2dae5',
          300: '#aabace',
          400: '#7c95b3',
          500: '#5b789a',
          600: '#475f81',
          700: '#3a4d69',
          800: '#334258',
          900: '#2e394b',
          950: '#1e2532',
        },
      },
    },
  },
  plugins: [],
};
export default config;
