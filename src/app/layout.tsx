"use client";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { StoreProvider, useStore } from "@/context/store-context";
// import { useEffect } from "react";
import Head from "next/head";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { state } = useStore();
  const { store } = state;
  // const color = store?.customColor;
  const storeName = store?.storeName || "Shop";
  const storeTag = store?.description || "The Best Online Store";

  // useEffect(() => {
  //   console.log("store", store);
  //   // Ensure the code only runs on the client side (browser)
  //   if (typeof window !== "undefined" && store?.customColor) {
  //     document.documentElement.style.setProperty(
  //       "--shop-theme-color",
  //       store.customColor
  //     );
  //   }
  // }, [store]);

  return (
    <html lang="en" className={outfit.className}>
      <Head>
        <title>
          {storeName} - {storeTag}
        </title>
        <meta
          name="description"
          content={`Shop at ${storeName} the best online shop!`}
        />
      </Head>
      <body
        className={` ${poppins.variable} antialiased min-h-screen flex flex-col`}
      >
        <StoreProvider>
          <CartProvider>
            <Header />
            <main className={`flex-1 w-full pt-16`}>{children}</main>
            <Toaster />
            <Footer />
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
