import "@/styles/globals.css";

import { dark } from "@clerk/themes";
import { type Metadata } from "next";
import { Karla } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "MoneyMap",
  description: "Personal Finance Management App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "hsl(1, 0%, 0%)",
          colorPrimary: "#fafafa",
          colorTextOnPrimaryBackground: "hsl(1, 0%, 0%)",
          colorInputBackground: "#131315",
        },
      }}
    >
      <html lang="en" className={`${karla.variable} dark`}>
        <body>
          <TRPCReactProvider>
            <main className="min-h-screen antialiased">{children}</main>
            <Toaster richColors />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
