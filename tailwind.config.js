/** @type {import('tailwindcss').Config} */
// const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./pages/*.html",
    "./pages/*.md",
    "./_posts/*.md",
    "./*.html",
  ],
  darkMode: "class",
  theme: {
    // typography: (theme) => ({
    //   DEFAULT: {
    //     css: {
    //       color: theme("colors.gray.700"),
    //       a: {
    //         color: theme("colors.primary.500"),
    //         "&:hover": {
    //           color: `${theme("colors.primary.600")} !important`,
    //         },
    //         code: { color: theme("colors.primary.400") },
    //       },
    //       h1: {
    //         fontWeight: "700",
    //         letterSpacing: theme("letterSpacing.tight"),
    //         color: theme("colors.gray.900"),
    //       },
    //       h2: {
    //         fontWeight: "700",
    //         letterSpacing: theme("letterSpacing.tight"),
    //         color: theme("colors.gray.900"),
    //       },
    //       h3: {
    //         fontWeight: "600",
    //         color: theme("colors.gray.900"),
    //       },
    //       "h4,h5,h6": {
    //         color: theme("colors.gray.900"),
    //       },
    //       pre: {
    //         backgroundColor: theme("colors.gray.800"),
    //       },
    //       code: {
    //         color: theme("colors.pink.500"),
    //         backgroundColor: theme("colors.gray.100"),
    //         paddingLeft: "4px",
    //         paddingRight: "4px",
    //         paddingTop: "2px",
    //         paddingBottom: "2px",
    //         borderRadius: "0.25rem",
    //       },
    //       "code::before": {
    //         content: "none",
    //       },
    //       "code::after": {
    //         content: "none",
    //       },
    //       details: {
    //         backgroundColor: theme("colors.gray.100"),
    //         paddingLeft: "4px",
    //         paddingRight: "4px",
    //         paddingTop: "2px",
    //         paddingBottom: "2px",
    //         borderRadius: "0.25rem",
    //       },
    //       hr: { borderColor: theme("colors.gray.200") },
    //       "ol li::marker": {
    //         fontWeight: "600",
    //         color: theme("colors.gray.500"),
    //       },
    //       "ul li::marker": {
    //         backgroundColor: theme("colors.gray.500"),
    //       },
    //       strong: { color: theme("colors.gray.600") },
    //       blockquote: {
    //         color: theme("colors.gray.900"),
    //         borderLeftColor: theme("colors.gray.200"),
    //       },
    //     },
    //   },
    //   dark: {
    //     css: {
    //       color: theme("colors.gray.300"),
    //       a: {
    //         color: theme("colors.primary.500"),
    //         "&:hover": {
    //           color: `${theme("colors.primary.400")} !important`,
    //         },
    //         code: { color: theme("colors.primary.400") },
    //       },
    //       h1: {
    //         fontWeight: "700",
    //         letterSpacing: theme("letterSpacing.tight"),
    //         color: theme("colors.gray.100"),
    //       },
    //       h2: {
    //         fontWeight: "700",
    //         letterSpacing: theme("letterSpacing.tight"),
    //         color: theme("colors.gray.100"),
    //       },
    //       h3: {
    //         fontWeight: "600",
    //         color: theme("colors.gray.100"),
    //       },
    //       "h4,h5,h6": {
    //         color: theme("colors.gray.100"),
    //       },
    //       pre: {
    //         backgroundColor: theme("colors.gray.800"),
    //       },
    //       code: {
    //         backgroundColor: theme("colors.gray.800"),
    //       },
    //       details: {
    //         backgroundColor: theme("colors.gray.800"),
    //       },
    //       hr: { borderColor: theme("colors.gray.700") },
    //       "ol li::marker": {
    //         fontWeight: "600",
    //         color: theme("colors.gray.400"),
    //       },
    //       "ul li::marker": {
    //         backgroundColor: theme("colors.gray.400"),
    //       },
    //       strong: { color: theme("colors.gray.100") },
    //       thead: {
    //         th: {
    //           color: theme("colors.gray.100"),
    //         },
    //       },
    //       tbody: {
    //         tr: {
    //           borderBottomColor: theme("colors.gray.700"),
    //         },
    //       },
    //       blockquote: {
    //         color: theme("colors.gray.100"),
    //         borderLeftColor: theme("colors.gray.700"),
    //       },
    //     },
    //   },
    // }),
    extend: {
      typography: {
        default: {
          css: {
            pre: {
              padding: "0",
              color: "#1F2933",
              backgroundColor: "#F3F3F3",
            },
            code: {
              padding: "0.2em 0.4em",
              backgroundColor: "#F3F3F3",
              color: "#DD1144",
              fontWeight: "400",
              "border-radius": "0.25rem",
            },
            "code::before": false,
            "code::after": false,
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
          },
        },
      },
    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography")],
};
