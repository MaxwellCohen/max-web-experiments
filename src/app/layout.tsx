import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TopNav} from "@/app/_components/topNav";

export const metadata: Metadata = {
  title: "Max's Web Experiments",
  description: "Web experiments and web tools to make your life a little better",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
      <div className="grid h-screen grid-rows-[auto,1fr] ">
        <TopNav />
        {children}
        </div>
        </body>
    </html>
  );
}
