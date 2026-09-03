import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bar Huddle - Owner",
  description: "Login to your Bar Huddle account",
  icons: {
    icon: "/barhuddle.svg",
    shortcut: "/barhuddle.svg",
    apple: "/barhuddle.svg",
  },
};

import Providers from "@/providers";
import { RouteProxy } from "@/components/RouteProxy";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className={`${manrope.className} min-h-full flex flex-col text-white font-['Manrope',sans-serif]`}>
        <Providers>
          <RouteProxy>{children}</RouteProxy>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
