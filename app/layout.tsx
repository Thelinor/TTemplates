import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RaidProvider } from "./RaidContext";
import { RaidSelectionProvider } from "./RaidSelectionContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RaidSelectionProvider>
          <RaidProvider>
            {children}
          </RaidProvider>
        </RaidSelectionProvider>
      </body>
    </html>
  );
}
