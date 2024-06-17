import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/svg/maiz.svg" sizes="any" type="image/x-icon" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        ></link>
        <title>Maiz</title>
        <meta
          name="description"
          content="Welcome to maiz, your ultimate destination for delicious food. Explore a wide range of mouth-watering dishes, and much more!"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
