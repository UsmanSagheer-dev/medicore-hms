"use client";

import { Geist, Geist_Mono, Poppins } from "next/font/google";
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

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import { ReduxProvider } from "@/redux/provider";
import InitializeAuth from "@/components/auth/InitializeAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isOnboardingPage = pathname?.startsWith("/onboarding");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-gray-50 h-screen flex flex-col overflow-hidden`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <InitializeAuth />
          {!isAuthPage && !isOnboardingPage && <Header />}
          <main className="flex-1 overflow-hidden ">{children}</main>
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
