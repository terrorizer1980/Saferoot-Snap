import { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  // This is required to make use of the React 17+ JSX transform.
  jsxRuntime: "automatic",

  plugins: [
    "gatsby-plugin-svgr",
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Saferoot",
        icon: "src/assets/saferoot_logo.png",
        theme_color: "#6F4CFF",
        background_color: "#FFFFFF",
        display: "standalone",
      }
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        custom: {
          families: ["Stolzl"],
          urls: ["src/styling/font.css"],
        },
      },
    },
  ],
};

export default config;
