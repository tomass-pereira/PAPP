/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  // Movido para fora do theme
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#4F4FB9",  
          "secondary": "#F0F0F0", 
          "accent": "#FFCC00",    
          "neutral": "#FFFFFF",   
          "base-100": "#FFFFFF",  
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
}