import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EcoShop - Your Online Shopping Destination",
  description: "Shop the latest products at the best prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${poppins.variable} antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Header />
          <main className={`flex-1 w-full pt-16`}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
