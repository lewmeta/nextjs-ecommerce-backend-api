import type { Metadata } from "next";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/providers/modal-provider";
import { Jost } from "next/font/google";

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

const jost = Jost({
  subsets: ['latin']
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
          className={`${jost.className} antialiased`}
        >
          <Toaster />
          <ModalProvider />
          <main className="h-screen">
            {children}
          </main>
        </body>
      </html>
    </SessionProvider>
  );
}
