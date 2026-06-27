/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        // Your existing title gradient animation
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // NEW: The auto-blinking button glow
        buttonGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(234,179,8,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(234,179,8,0.9)' },
        },
      },
      animation: {
        gradient: 'gradient 1s ease infinite',
        // NEW: Apply the glow to pulse continuously every 2 seconds
        'button-glow': 'buttonGlow 0.8s ease-in-out infinite', 
      },
    },
  },
  plugins: [],
};