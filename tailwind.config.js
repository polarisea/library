import plugin from "tailwindcss/plugin";
import postcss from "postcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      const preflightStyles = postcss.parse(
        `
    /* Your preflight styles here */
  `,
      );

      // Remove preflight styles for elements with 'preflight' class
      preflightStyles.walkRules((rule) => {
        if (rule.selector.includes(".preflight")) {
          rule.remove();
        }
      });

      addBase(preflightStyles.nodes);
    }),
  ],
  //   corePlugins: {
  //     preflight: false,
  //   },
};
