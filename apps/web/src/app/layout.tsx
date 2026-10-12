import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RealtimeSyncBridge } from "@/components/RealtimeSyncBridge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeArena - DSA Learning Platform",
  description: "Learn DSA. Practice Coding. Assess Skills. Get Interview Ready.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <RealtimeSyncBridge />
        {children}
      </body>
    </html>
  );
}
