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
import { toast } from "sonner";
import { storeApi } from "@/lib/api";
import { useStore } from "@/context/store-context";
import { formatMoney } from "@/lib/utils";

interface ProductDrawerProps {
  id: number | string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDrawer({ id, open, onOpenChange }: ProductDrawerProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    colour?: string;
    size?: string;
  }>({});

  const { state } = useStore();
  const { store } = state;
  useEffect(() => {
    async function getProductById(id: number | string | undefined) {
      setLoading(true);
      try {
        if (id !== undefined) {
          const product = await storeApi.getSingleProduct(id);
          setProduct(product);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getProductById(id);
  }, [id]);

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
  const handleBuyNow = () => {
    if (!product) return; // Ensure the product exists

    const updatedProduct = {
      ...product,
      quantity,
      selectedOptions,
    };
    sessionStorage.setItem("buyItem", JSON.stringify(updatedProduct));
    sessionStorage.setItem("fromBuyNow", JSON.stringify(true));
    router.push("/checkout?buyNow=true");
    onOpenChange(false);
  };
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
          {loading && (
            <div className="flex flex-col h-full">
              {/* Product Image Skeleton */}
              <div className="relative h-[350px] mt-4 w-[96%] bg-gray-200 rounded-lg animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Product Details Skeleton */}
              <div className="p-5 flex-1 overflow-auto">
                {/* Title and Rating Skeleton */}
                <div className="mb-3 space-y-2">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse"
                      ></div>
                    ))}
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-1"></div>
                  </div>
                </div>

                {/* Price & Stock Skeleton */}
                <div className="flex justify-between items-center mb-3">
                  <div className="space-y-1">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Description Skeleton */}
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Options Skeleton */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="space-y-1.5">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-9 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-9 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Quantity Skeleton */}
                <div className="mb-5 space-y-1.5">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-6 bg-gray-200 rounded animate-pulse mx-3"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Actions Skeleton */}
              <div className="p-5 border-t">
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          {!loading && (
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
                  <div className="flex items-center mt-1 sm:mt-2 mb-3 sm:mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
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
                    <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-600">
                      {product.rating} out of 5
                    </span>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xl font-bold">
                      {formatMoney(product.salePrice, store?.currencySymbol)}
                    </p>
                    {product.originalPrice > product.salePrice && (
                      <p className="text-xs text-gray-500 line-through">
                        {formatMoney(
                          product.originalPrice,
                          store?.currencySymbol
                        )}
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
                            {[...new Set(product.options.colour)].map(
                              (color) => (
                                <SelectItem key={color} value={color}>
                                  {color}
                                </SelectItem>
                              )
                            )}
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
                          {[...new Set(product.options.size)].map((size) => (
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
                        toast.success("Added to cart");
                        onOpenChange(false);
                      }
                    }}
                    disabled={product.currentStock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    className="rounded-full h-10 bg-theme-color cursor-pointer"
                    onClick={handleBuyNow}
                    disabled={product.currentStock === 0}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
