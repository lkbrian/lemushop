"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore } from "@/context/store-context";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product, event: React.MouseEvent) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showQuickView] = useState(false);
  const { state } = useStore();

  // Destructure the state
  const { store } = state;

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
        setIsMobile(true);
        return "Mobile";
      } else {
        setIsMobile(false);
        return "Laptop/Desktop";
      }
      // Tailwind's md breakpoint
    };

    // Initial check
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleQuickViewClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Stop event bubbling
    onQuickView(product, event);
  };

  const handleCardClick = (event: React.MouseEvent) => {
    if (showQuickView && product.currentStock === 0) {
      event.preventDefault();
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      passHref
      as={`/product/${product.id}`}
      onClick={handleCardClick}
      className="group relative rounded-lg border bg-white overflow-hidden transition-all hover:shadow-md"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="100%"
          priority
        />
      </div>

      <div className={`p-4 pb-0.5 ${isMobile && "mb-10"}`}>
        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">
            {store?.currencySymbol + " "}
            {product.salePrice}
          </p>
          {product.originalPrice > product.salePrice && (
            <p className="text-xs text-gray-500 line-through">
              {store?.currencySymbol}
              {product.originalPrice}
            </p>
          )}
        </div>
      </div>

      {/* Mobile: Always show Quick View button */}
      {isMobile && (
        <Button
          className={`absolute  bottom-0 left-0 right-0 ${
            product.currentStock === 0 ? "cursor-not-allowed" : "cursor-pointer"
          } w-full rounded-none shop--button`}
          onClick={handleQuickViewClick}
          // disabled={product.currentStock === 0}
        >
          Quick View
        </Button>
      )}

      {/* Desktop: Show on hover */}
      {!isMobile && (
        <Button
          className={`absolute ${
            product.currentStock === 0 ? "cursor-not-allowed" : "cursor-pointer"
          } bottom-0 left-0 right-0 translate-y-full opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 rounded-none shop--button`}
          onClick={handleQuickViewClick}
          // disabled={product.currentStock === 0}
        >
          Quick View
        </Button>
      )}
    </Link>
  );
}
