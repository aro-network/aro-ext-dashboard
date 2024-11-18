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
        iconcard: "url('/bg-icon-card.svg'),linear-gradient(62.88deg, rgba(255, 255, 255, 0.1) 0.45%, rgba(255, 255, 255, 0.15) 99.55%)",
        iconcardin: "url('/bg-icon-card.svg'), linear-gradient(rgba(245, 245, 245, 0.1),rgba(245, 245, 245, 0.1))",
        m1: "linear-gradient(37.63deg, #233F7B 5.22%, #00000F 88.49%)",
      },
      boxShadow: {
        1: "0px 0px 2px 0px #FFFFFF1A inset",
        2: "0px 4px 4px 0 rgba(0,0,0,0.25)",
      },
      colors: {
        primary: {
          DEFAULT: "#0085FD",
        },
        default: {
          DEFAULT: "rgba(255, 255, 255, 0.15)",
        },
      },
      fontFamily: {
        HelveticaNeue: "var(--HelveticaNeue)",
        Poppins: "var(--Poppins)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
