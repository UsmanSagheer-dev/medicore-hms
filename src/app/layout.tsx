"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ReduxProvider } from "@/redux/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 h-screen flex flex-col overflow-hidden`}
      >
        <ReduxProvider>
          {!isAuthPage && <Header />}
          <main className="flex-1 overflow-hidden p-4 sm:p-6">{children}</main>
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
