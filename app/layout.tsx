import { SiteHeader } from "@/components/ui/site-header";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/providers";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Adamik Demo App",
  description: "Adamik Demo App for the Adamik API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-secondary font-sans antialiased",
          fontSans.variable,
        )}
      >
        <AppProviders>
          <SiteHeader />
          <main className="mx-auto max-w-[59rem] flex-1 auto-rows-max gap-4 p-4 md:p-8">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
