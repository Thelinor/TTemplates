import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RaidProvider } from "./RaidContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TTemplate - ESO Raid Tool",
  description: "Organisez vos équipes de raid ESO",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Root layout: fournit le provider global unique RaidProvider
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RaidProvider>{children}</RaidProvider>
      </body>
    </html>
  );
}
