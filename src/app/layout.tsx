import { PageLayout } from "./client";
import "./global.css";
import "react-circular-progressbar/dist/styles.css";
import "flag-icons/css/flag-icons.min.css";

export const metadata = {
  title: "EnReach Dashboard",
  description: "EnReach Dashboard",
};

import { Albert_Sans, Alexandria } from "next/font/google";
const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-albert-sans',
});

const alexandria = Alexandria({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal'],
  variable: '--font-alexandria',
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${albertSans.className} ${alexandria.className}`}>
      <head>
      </head>
      <body>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
