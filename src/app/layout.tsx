import type { Metadata } from "next";

import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import Navigation from "@/components/Navigation";


export const metadata: Metadata = {
  title: "product-app",
  description: "test work about products cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Navigation/>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
