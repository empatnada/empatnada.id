/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "corporate", // Tema Default Web
      {
        "logistik-theme": {
          "primary": "#E30613",    // Merah Logo
          "secondary": "#1A1A1A",  // Hitam Gelap
          "accent": "#D29F68",     // Cokelat Muda/Emas
          "base-100": "#FFFFFF",   // Putih Bersih (Card)
          "base-200": "#F3F4F6",   // Abu-abu Terang (Background)
        },
      },
    ],
  },
};
