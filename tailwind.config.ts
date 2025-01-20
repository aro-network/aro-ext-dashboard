import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        l1: "linear-gradient(62.88deg, rgba(255, 255, 255, 0.1) 0.45%, rgba(255, 255, 255, 0.15) 99.55%)",
        l2: "linear-gradient(44.61deg, rgba(255,255,255,0.1) 0.34%, rgba(255,255,255,0.15) 99.66%)",
        // background: linear-gradient(62.88deg, rgba(255, 255, 255, 0.2) 0.45%, rgba(255, 255, 255, 0.25) 99.55%);
        m1: "linear-gradient(37.63deg, #233F7B 5.22%, #00000F 88.49%)",
        s1: "url('/bg-shadow.png')",

        overview: "url('/overview.png')",
        tit: "url('/bg-title.png')",
      },
      boxShadow: {
        1: "0px 2px 0px 0px #6D6D6D66",
        2: "0px 4px 4px 0 rgba(0,0,0,0.25)",
      },
      screens: {
        smd: { max: "1000px" },
        xsl: { min: "1000px", max: "1800px" },
      },
      colors: {
        primary: {
          DEFAULT: "#4281FF",
        },
        default: {
          DEFAULT: "rgba(255, 255, 255, 0.15)",
        },
        green: {
          400: "#34D399",
        },
        gray: {
          1: "#404040",
        },
      },
      fontFamily: {
        HelveticaNeue: "var(--HelveticaNeue)",
        AlbertSans: "var(--font-albert-sans)",
        Alexandria: "var(--font-alexandria)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
