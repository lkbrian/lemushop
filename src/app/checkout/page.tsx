"use client";

import {
  PersonalInfoForm,
  type PersonalInfoValues,
} from "@/components/personal-info-form";
// import { SecurePaymentIframe } from "@/components/secure-payment-Iframe";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/store-context";
import { storeApi } from "@/lib/api";
import { CartPayload, PayloadCartItem } from "@/lib/types";
import { formatPayload } from "@/lib/utils";
// import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import { Suspense, useState } from "react";
// import { toast } from "sonner";

// type CheckoutStep = "personal" | "payment";
// type PaymentMethod = "mpesa" | "card";

function CheckoutPage() {
  const searchParams = useSearchParams();
  const buyNow = searchParams.get("buyNow");
  // const router = useRouter()
  const { state } = useStore();
  const { store } = state;
  // const [currentStep, setCurrentStep] = useState<CheckoutStep>("personal");
  // const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoValues | null>(
    null
  );

  const handlePersonalInfoSubmit = async (values: PersonalInfoValues) => {
    setPersonalInfo(values);
    setIsSubmitting(true);
    try {
      const res = await storeApi.createCustomer(values);
      console.log("Customer created:", res);

      if (!res || !res.id) {
        throw new Error("Customer creation failed or missing customer ID");
      }
      const customerId = res.id;
      const fromBuyNow = buyNow === "true";

      // Retrieve and parse buyNowCart
      const buyNowCartJson = sessionStorage.getItem("buyItem");
      const parsedBuyNowCart: PayloadCartItem | null = buyNowCartJson
        ? JSON.parse(buyNowCartJson)
        : null;

      // Retrieve and parse cartItems
      const cartItemsJson = sessionStorage.getItem("cartItems");
      const parsedCartItems: PayloadCartItem[] = cartItemsJson
        ? JSON.parse(cartItemsJson)
        : [];

      // Build the cart array with proper typing
      const cart: PayloadCartItem[] = fromBuyNow
        ? parsedBuyNowCart
          ? [parsedBuyNowCart]
          : []
        : parsedCartItems;

      const data: CartPayload = {
        customerId: customerId,
        storeId: store?.storeId || 1,
        cart: cart,
      };

      const orderPayload = formatPayload(data);
      try {
        const orderRes = await storeApi.createOrder(orderPayload);
        const generatedPaymentUrl = `https://payments.lemuapps.com/payments/checkout/?orderId=${orderRes.orderId}`;
        // window.location.href = generatedPaymentUrl;
        // setPaymentUrl(generatedPaymentUrl);
        window.open(generatedPaymentUrl, "_blank");
        sessionStorage.removeItem("cartItems");

        console.log("Order created:", orderRes);
      } catch (orderError) {
        console.error("Error creating order:", orderError);
        return;
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handlePaymentComplete = () => {
  //   toast.success("Payment completed successfully!");
  //   // Redirect to success page or show success message
  //   window.location.href = `/checkout/success?orderId=feytew636-4`;
  // };

  // const handlePaymentError = (errorMessage: string) => {
  //   setError(errorMessage);
  //   toast.error(`Payment failed: ${errorMessage}`);
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </div>
            <CardDescription>
              Please provide your contact details
            </CardDescription>
          </CardHeader>
          <Separator />

          <PersonalInfoForm
            initialValues={personalInfo || undefined}
            onSubmit={handlePersonalInfoSubmit}
            isSubmitting={isSubmitting}
          />

          {/* {!isSubmitting && paymentUrl && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              {paymentUrl ? (
                <div className="w-full max-w-3xl mx-auto p-4">
                  <SecurePaymentIframe
                    paymentUrl={paymentUrl}
                    onComplete={handlePaymentComplete}
                    onError={handlePaymentError}
                    height="600px"
                  />
                </div>
              ) : error ? (
                <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
                  <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                  <button
                    className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md"
                    onClick={() => setIsSubmitting(false)}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center w-full  h-full p-6 rounded-lg shadow-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-600">
                    Processing your information...
                  </p>
                </div>
              )}
            </div>
          )} */}
        </Card>
      </div>
    </div>
  );
}
export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
