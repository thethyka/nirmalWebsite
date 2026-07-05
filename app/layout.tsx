import type React from "react";
import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const gurmukhi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  weight: ["400", "500"],
  variable: "--font-gurmukhi",
});

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
      <body className={`${inter.variable} ${cormorant.variable} ${gurmukhi.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-memorial">
          <Navigation />
          <main className="relative">{children}</main>
        </div>
      </body>
    </html>
  );
}
