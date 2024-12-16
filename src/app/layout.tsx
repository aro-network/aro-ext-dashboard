import { PageLayout } from "./client";
import "./global.css";
import "react-circular-progressbar/dist/styles.css";
import "flag-icons/css/flag-icons.min.css";

export const metadata = {
  title: "EnReach Dashboard",
  description: "EnReach Dashboard",
};

import { Poppins } from "next/font/google"; // Helvetica Neue
import localFont from "next/font/local";
import { cn } from "@nextui-org/react";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--Poppins",
});
const helvetica = localFont({
  variable: "--HelveticaNeue",

  src: [
    {
      path: "./HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});
const fonts = [popins, helvetica];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark", fonts.map((f) => f.variable).join(" "), "font-Poppins")}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link href="https://fonts.cdnfonts.com/css/abc-ginto-nord-unlicensed-trial" rel="stylesheet"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Alexandria:wght@100..900&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
