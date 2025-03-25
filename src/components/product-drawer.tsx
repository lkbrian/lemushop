"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

interface ProductDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDrawer({
  product,
  open,
  onOpenChange,
}: ProductDrawerProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    colour?: string;
    size?: string;
  }>({});

  // Reset quantity and selected options when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);

      // Set default options if available
      const defaultOptions: { colour?: string; size?: string } = {};
      if (product.options?.colour && product.options.colour.length > 0) {
        defaultOptions.colour = product.options.colour[0];
      }
      if (product.options?.size && product.options.size.length > 0) {
        defaultOptions.size = product.options.size[0];
      }
      setSelectedOptions(defaultOptions);
    }
  }, [product]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  if (!product) return null;

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.currentStock) {
      setQuantity(value);
    }
  };

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const images = product.images || (product.imageUrl ? [product.imageUrl] : []);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 z-50 
        w-[90%] sm:w-[400px] md:w-[450px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div data-slot="drawer" className="relative h-full">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-1 shadow-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col h-full">
            {/* Product Image - Smaller and fixed height */}
            {images.length > 0 && (
              <div className="relative h-[350px] mt-4 w-[96%]">
                <Image
                  src={images[0] || "/placeholder.s"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="100%"
                />
              </div>
            )}

            {/* Product Details */}
            <div className="p-5 flex-1 overflow-auto">
              {/* Title and Rating */}
              <div className="mb-3">
                <h2 className="text-lg font-bold">{product.name}</h2>
                {product.rating && (
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">
                      {product.rating} out of 5
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Stock */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xl font-bold">
                    ${(product.salePrice / 100).toFixed(2)}
                  </p>
                  {product.originalPrice > product.salePrice && (
                    <p className="text-xs text-gray-500 line-through">
                      ${(product.originalPrice / 100).toFixed(2)}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {product.currentStock > 0 ? (
                    <span className="text-green-600">
                      {product.currentStock} in stock
                    </span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              </div>

              {/* Description - Shorter with max height */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {product.options?.colour &&
                  product.options.colour.length > 0 && (
                    <div className="mb-4">
                      <Label
                        htmlFor="color"
                        className="block text-sm font-medium mb-1.5"
                      >
                        Color
                      </Label>
                      <Select
                        value={selectedOptions.colour || ""}
                        onValueChange={(value) =>
                          handleOptionChange("color", value)
                        }
                      >
                        <SelectTrigger id="color" className="h-9 w-full">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.options.colour.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                {product.options?.size && product.options.size.length > 0 && (
                  <div className="mb-4">
                    <Label
                      htmlFor="size"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Size
                    </Label>
                    <Select
                      value={selectedOptions.size || ""}
                      onValueChange={(value) =>
                        handleOptionChange("size", value)
                      }
                    >
                      <SelectTrigger id="size" className="h-9 w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.options.size.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-5">
                <Label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-1.5"
                >
                  Quantity
                </Label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="mx-3 w-6 text-center text-sm">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.currentStock}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="p-5 border-t">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="rounded-full h-10 cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addItem({
                        ...product,
                        selectedOptions,
                      });
                    }
                  }}
                  disabled={product.currentStock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  className="rounded-full h-10 cursor-pointer"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addItem({
                        ...product,
                        selectedOptions,
                      });
                    }
                    onOpenChange(false);
                    router.push("/checkout");
                  }}
                  disabled={product.currentStock === 0}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
