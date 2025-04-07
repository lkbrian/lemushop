"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { useStore } from "@/context/store-context";
import { storeApi } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams(); // ✅ Fetch params correctly
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    colour?: string;
    size?: string;
  }>({});

  const { addItem } = useCart();
  const { state } = useStore();
  const { store } = state;
  useEffect(() => {
    async function getProductById() {
      setLoading(true);
      const id = Number(params?.id);
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
    getProductById();
  }, [params?.id]);

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
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       // Get product by ID using the params directly
  //       const productId = Number(params?.id);
  //       const foundProduct = getProductById(productId);

  //       if (foundProduct) {
  //         setProduct(foundProduct);

  //         // Set default options if available
  //         const defaultOptions: { colour?: string; size?: string } = {};
  //         if (
  //           foundProduct.options?.colour &&
  //           foundProduct.options.colour.length > 0
  //         ) {
  //           defaultOptions.colour = foundProduct.options.colour[0];
  //         }
  //         if (
  //           foundProduct.options?.size &&
  //           foundProduct.options.size.length > 0
  //         ) {
  //           defaultOptions.size = foundProduct.options.size[0];
  //         }
  //         setSelectedOptions(defaultOptions);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching product:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProduct();
  // }, [params.id]);

  const handleQuantityChange = (value: number) => {
    if (product && value >= 1 && value <= product.currentStock) {
      setQuantity(value);
    }
  };

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Add to cart with quantity and options
    for (let i = 0; i < quantity; i++) {
      addItem({
        ...product,
        selectedOptions,
      });
    }
  };

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
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-md"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <p className="text-gray-500 mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button className="bg-theme-color" onClick={() => router.push("/")}>
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 mt-16">
      <div className="flex flex-col md:flex-row md:gap-8 gap-6">
        {/* Product Images - Mobile first column layout */}
        <div className="w-full md:w-1/2">
          {/* Main image - adjusted height for mobile */}
          <div className="aspect-square w-full h-[300px] sm:h-[400px] md:h-[500px] relative rounded-lg overflow-hidden mb-3 sm:mb-4">
            <Image
              src={
                product.images?.[selectedImage] ||
                product.imageUrl ||
                "/placeholder.svg"
              }
              alt={product.name}
              fill
              className="object-contain rounded-md"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar scrollbar-thin ">
            {(product.images || [product.imageUrl]).map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 aspect-square w-[80px] h-[80px]  relative rounded-md overflow-hidden cursor-pointer  ${
                  selectedImage === index
                    ? "border border-[#003049] shadow-md"
                    : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details - full width on mobile */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>

          {/* Rating - adjusted spacing for mobile */}
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

          {/* Price - adjusted text size for mobile */}
          <div className="flex items-baseline mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl font-bold">
              {formatMoney(product.salePrice, store?.currencySymbol)}
            </span>
            {product.originalPrice > product.salePrice && (
              <>
                <span className="ml-2 text-sm sm:text-base text-gray-500 line-through">
                  {formatMoney(product.originalPrice, store?.currencySymbol)}
                </span>
                <span className="ml-2 text-sm sm:text-base text-green-600 font-medium">
                  {formatMoney(
                    product.originalPrice - product.salePrice,
                    store?.currencySymbol
                  )}
                </span>
              </>
            )}
          </div>

          {/* Description - smaller text on mobile */}
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            {product.description}
          </p>

          {/* Availability */}
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              Availability:
            </p>
            <p
              className={`text-sm sm:text-base font-medium ${
                product.currentStock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.currentStock > 0
                ? `In Stock (${product.currentStock} available)`
                : "Out of Stock"}
            </p>
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* Color Options - adjusted spacing */}
          <div className="grid grid-cols-2 gap-3">
            {product.options?.colour && product.options.colour.length > 0 && (
              <div className="mb-4">
                <Label
                  htmlFor="color"
                  className="block text-sm font-medium mb-1.5"
                >
                  Color
                </Label>
                <Select
                  value={selectedOptions.colour || ""}
                  onValueChange={(value) => handleOptionChange("color", value)}
                >
                  <SelectTrigger id="color" className="h-9 w-full">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.options.colour.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color || "c"}
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
                  onValueChange={(value) => handleOptionChange("size", value)}
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

          {/* Quantity - adjusted spacing */}
          <div className="mb-4 sm:mb-6">
            <Label
              htmlFor="quantity"
              className="text-xs sm:text-sm font-medium mb-1 block"
            >
              Quantity
            </Label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="mx-3 w-8 text-center text-sm sm:text-base">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.currentStock}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons - stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
            <Button
              className="w-full sm:flex-1 h-10  bg-theme-color rounded-full cursor-pointer"
              size="sm"
              onClick={handleBuyNow}
              disabled={product.currentStock === 0}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-10 rounded-full cursor-pointer"
              size="sm"
              onClick={() => {
                handleAddToCart();
                sessionStorage.setItem("fromBuyNow", JSON.stringify(true));
              }}
              disabled={product.currentStock === 0}
            >
              <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Add to Cart
            </Button>
            <Button variant="ghost" size="sm" className="w-10 sm:w-auto">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs - full width */}
      <div className="mt-8 sm:mt-12 max-w-3xl">
        <Tabs defaultValue="features">
          <TabsList className="w-full justify-start border-b rounded-none overflow-x-auto">
            <TabsTrigger value="features" className="text-xs sm:text-sm">
              Features
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-xs sm:text-sm">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="py-3 sm:py-4">
            {product.features && product.features.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm sm:text-base">
                No features available for this product.
              </p>
            )}
          </TabsContent>
          <TabsContent value="specifications" className="py-3 sm:py-4">
            {product.specifications &&
            Object.keys(product.specifications).length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b pb-2">
                    <span className="font-medium w-1/3 text-sm sm:text-base">
                      {key}
                    </span>
                    <span className="w-2/3 text-sm sm:text-base">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base">
                No specifications available for this product.
              </p>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="py-3 sm:py-4">
            <p className="text-sm sm:text-base">
              No reviews yet. Be the first to review this product.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
