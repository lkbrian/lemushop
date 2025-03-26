"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useStore } from "@/context/store-context";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { numberOfCartItems } = useCart();
  const { state } = useStore();

  // Destructure the state
  const { store, loading } = state;
  console.log("header", store);
  // if (store) {
  //   document.documentElement.style.setProperty(
  //     "--shop-theme-color",
  //     store?.customColor
  //   );
  // }
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b font-['Poppins']">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex flex-col">
          {loading && (
            <>
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[450px]" />
            </>
          )}
          {!loading && (
            <>
              <Link href="/" className="text-xl font-bold">
                {store?.storeName}
              </Link>
              <span className="text-xs text-gray-500 -mt-1 line-clamp-1">
                {store?.description}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="#">
              <User className="h-4 w-4 mr-2" />
              Become a seller
            </Link>
          </Button>

          {/* <Separator orientation="vertical" className="h-6 mx-2" /> */}
          <div className="px-4">|</div>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {numberOfCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {numberOfCartItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
