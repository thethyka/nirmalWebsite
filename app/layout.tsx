import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Nirmal Singh Ahluwalia",
  description: "In loving memory of Dr. Nirmal Singh Ahluwalia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100">
          <Navigation />
          <main className="relative">{children}</main>
        </div>
      </body>
    </html>
  );
}
