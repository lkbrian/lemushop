"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useStore } from "@/context/store-context";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    isLoading,
  } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const { state } = useStore();
  const { store } = state;

  const subtotal = cartItems
    ? cartItems.reduce((total, item) => {
        const price = item.salePrice || item.price || 0;
        return total + Number(price) * item.quantity;
      }, 0)
    : 0;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal - discount + shipping;

  const updateQuantity = (
    id: number | string,
    newQuantity: number,
    currentQuantity: number
  ) => {
    if (newQuantity < 1) return;

    if (newQuantity > currentQuantity) {
      increaseQuantity(id);
    } else {
      decreaseQuantity(id);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true);
    } else {
      alert("Invalid promo code");
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      ) : !cartItems || cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Cart Items ({cartItems.length})
                </h2>

                <div className="space-y-6">
                  {cartItems &&
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="relative h-24 w-24 rounded-md overflow-hidden">
                            <Image
                              src={
                                typeof item.imageUrl === "string" &&
                                item.imageUrl
                                  ? item.imageUrl
                                  : "/placeholder.svg"
                              }
                              alt={item.name as string}
                              fill
                              className="object-cover"
                              priority
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">
                              {item.name as string}
                            </h3>
                            <p className="font-semibold">
                              {store?.currencySymbol + " "}
                              {((item.salePrice || item.price || 0) as number) *
                                item.quantity}
                            </p>
                          </div>

                          <p className="text-sm text-gray-500 mt-1">
                            {item.description as string}
                          </p>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                    item.quantity
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-3 w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                    item.quantity
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg border p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>
                    {store?.currencySymbol + " "}
                    {subtotal}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -{store?.currencySymbol + " "}
                      {discount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shipping === 0
                      ? "Free"
                      : `${store?.currencySymbol + " "}${shipping}`}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {store?.currencySymbol + " "}
                    {total}
                  </span>
                </div>

                <div className="pt-4">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                    >
                      Apply
                    </Button>
                  </div>

                  {promoApplied && (
                    <p className="text-sm text-green-600 mb-4">
                      Promo code applied: 10% discount
                    </p>
                  )}

                  <Button
                    className="w-full h-10 bg-theme-color"
                    onClick={() => {
                      handleCheckout();
                      sessionStorage.setItem(
                        "fromBuyNow",
                        JSON.stringify(false)
                      );
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
