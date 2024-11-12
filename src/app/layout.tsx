import { PageLayout } from "./client";
import "./global.css";
export const metadata = {
  title: "EnReach.AI",
  description: "EnReach.AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
