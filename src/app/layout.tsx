import type { Metadata } from "next";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/providers/modal-provider";
import { Jost, Poppins } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: "400"
})

export const metadata: Metadata = {
  title: "Nextjs Backend API and admin panel",
  description: "Nextjs Backend API and admin panel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${poppins.className}`}
        >
          <Toaster />
          <ModalProvider />
          <TooltipProvider>
            <main className="h-screen">
              {children}
            </main>
          </TooltipProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
