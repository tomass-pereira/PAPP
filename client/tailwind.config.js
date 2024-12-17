/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
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

