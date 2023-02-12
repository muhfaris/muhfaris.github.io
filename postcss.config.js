module.exports = {
  parser: 'postcss-scss',
  plugins: [
    require("postcss-import"),
    require("tailwindcss")("./tailwind.config.js"),
    require("autoprefixer"),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
