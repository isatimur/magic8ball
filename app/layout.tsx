import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const caveat = localFont({
  src: "./fonts/Caveat-VariableFont_wght.ttf",
  variable: "--font-caveat",
  weight: "100 900",
});
const sevillana = localFont({
    src: "./fonts/Sevillana-Regular.ttf",
    variable: "--font-sevillana",
    weight: "700",
});

export const metadata: Metadata = {
  title: "Magic 8 Ball",
  description: "If you believe in it . . .",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${caveat.variable} ${sevillana.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
