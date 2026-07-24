/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111827',
          hover: '#1F2937',
        },
        accent: {
          DEFAULT: '#6C2BD9',
          hover: '#5B21B6',
          light: '#F5F3FF',
          muted: '#DDD6FE',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
          tertiary: '#F3F4F6',
        },
        border: {
          DEFAULT: '#E5E7EB',
          hover: '#D1D5DB',
          focus: '#6C2BD9',
        },
        success: { DEFAULT: '#059669', light: '#ECFDF5' },
        warning: { DEFAULT: '#D97706', light: '#FFFBEB' },
        error: { DEFAULT: '#DC2626', light: '#FEF2F2' },
        info: { DEFAULT: '#2563EB', light: '#EFF6FF' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
