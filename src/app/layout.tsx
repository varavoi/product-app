import type { Metadata } from "next";

import "./globals.css";



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
        {children}
      </body>
    </html>
  );
}
