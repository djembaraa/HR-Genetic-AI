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
          DEFAULT: '#09090B', // Zinc 950
          hover: '#18181B', // Zinc 900
        },
        accent: {
          DEFAULT: '#18181B', // Using almost black for a very premium minimalist feel instead of purple
          hover: '#27272A',
          light: '#F4F4F5',
          muted: '#E4E4E7',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAFAFA', // Zinc 50
          tertiary: '#F4F4F5', // Zinc 100
        },
        border: {
          DEFAULT: '#E4E4E7', // Zinc 200
          hover: '#D4D4D8', // Zinc 300
          focus: '#09090B',
        },
        success: { DEFAULT: '#10B981', light: '#ECFDF5' },
        warning: { DEFAULT: '#F59E0B', light: '#FFFBEB' },
        error: { DEFAULT: '#EF4444', light: '#FEF2F2' },
        info: { DEFAULT: '#3B82F6', light: '#EFF6FF' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        float: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
