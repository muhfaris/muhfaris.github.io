/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
  purge: ["{,!(node_modules|_site)/**/}*.{html,md}"],
};
