"use client";
import { Suspense } from "react";

import { CardForm, type CardFormValues } from "@/components/card-form";
import { MpesaForm, type MpesaFormValues } from "@/components/mpesa-form";
import {
  PersonalInfoForm,
  type PersonalInfoValues,
} from "@/components/personal-info-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/store-context";
import { storeApi } from "@/lib/api";
import {
  CartPayload,
  PayloadCartItem,
  statusPayload,
  StatusResponse,
  StkPayload,
} from "@/lib/types";
import { formatPayload } from "@/lib/utils";
import { CheckCircle2, CreditCard, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type CheckoutStep = "personal" | "payment";
type PaymentMethod = "mpesa" | "card";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const buyNow = searchParams.get("buyNow");
  const { state } = useStore();
  const { store } = state;
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("personal");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoValues | null>(
    null
  );
  const [mpesaInfo, setMpesaInfo] = useState<MpesaFormValues>({
    mpesaNumber: "",
  });
  const [cardInfo, setCardInfo] = useState<CardFormValues>({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // // Handle personal info form submission
  // const handlePersonalInfoSubmit = (values: PersonalInfoValues) => {
  //   // Pre-fill mpesa number with mobile number
  //   async function createUser (values:PersonalInfoValues){
  //     const res = await storeApi.createCustomer(values)
  //     console.log(res)

  //   }
  //   createUser(values)
  //   setMpesaInfo((prev) => ({
  //     ...prev,
  //     mpesaNumber: values.mobileNumber,
  //   }));
  //   setCurrentStep("payment");
  // };

  const handlePersonalInfoSubmit = async (values: PersonalInfoValues) => {
    setPersonalInfo(values);
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
        console.log("Order created:", orderRes);
      } catch (orderError) {
        console.error("Error creating order:", orderError);
        return;
      }

      setMpesaInfo((prev) => ({
        ...prev,
        mpesaNumber: values.mobileNumber,
      }));

      setCurrentStep("payment");
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };
  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Handle mpesa form submission
  //   const handleMpesaSubmit = (values: MpesaFormValues) => {
  //     setIsSubmitting(true);
  //     try {
  //     setMpesaInfo(values);
  //     const mobilenumber = values.mpesaNumber;
  //     const randomUUID = uuidv4()
  //      const payload: StkPayload = {
  //   ipnEnabled: true,
  //   callbackurl: "https://webhook.site/db7cb5a0-fb21-4381-9c3d-9100cea2f55b",
  //   title: "test",
  //   merchantId: "exelient",
  //   source: {
  //     countryCode: "KEN",
  //     accountNumber: "110000008",
  //   },
  //   destination: {
  //     requestId: `1-default-${randomUUID}`,
  //     accountType: "MobileWallet",
  //     countryCode: "KE",
  //     serviceType: "CustomerPayBillOnline",
  //     recipientName: "Elvis Kipchumba",
  //     accountNumber: mobilenumber,
  //     accountReference: mobilenumber,
  //     mobileNumber: mobilenumber,
  //     accountIssuer: "Safaricom",
  //     transactionType: "MobileWallet",
  //     amount: "1",
  //     currency: "KES",
  //     remarks: "Exellient",
  //     timestamp: `${Date.now()}`,
  //     bankCode: "",
  //   },
  // };

  //     } catch (error) {
  //       console.log(error)
  //     }

  //     // Prepare cart data
  //     const fromBuyNow = buyNow === "true";
  //     const buyNowCart = sessionStorage.getItem("buyItem");
  //     const cartItems = sessionStorage.getItem("cartItems");

  //     const data = {
  //       personalInfo,
  //       paymentMethod: "mpesa",
  //       paymentDetails: { mpesaNumber: values.mpesaNumber },
  //       cart: fromBuyNow ? buyNowCart : cartItems,
  //     };

  //     // Simulate API call
  //     setTimeout(() => {
  //       console.log("Checkout completed with M-Pesa:", data);
  //       setIsSubmitting(false);

  //       // Show success message
  //       window.alert("Checkout completed successfully with M-Pesa!");
  //     }, 1500);
  //   };
  const handleMpesaSubmit = async (values: MpesaFormValues) => {
    setIsSubmitting(true);
    try {
      setMpesaInfo(values);
      const mobilenumber = values.mpesaNumber;
      const randomUUID = uuidv4();
      const payload: StkPayload = {
        ipnEnabled: true,
        callbackurl:
          "https://webhook.site/db7cb5a0-fb21-4381-9c3d-9100cea2f55b",
        title: "test",
        merchantId: "exelient",
        source: {
          countryCode: "KEN",
          accountNumber: "110000008",
        },
        destination: {
          requestId: `1-default-${randomUUID}`,
          accountType: "MobileWallet",
          countryCode: "KE",
          serviceType: "CustomerPayBillOnline",
          recipientName: "Elvis Kipchumba",
          accountNumber: mobilenumber,
          accountReference: mobilenumber,
          mobileNumber: mobilenumber,
          accountIssuer: "Safaricom",
          transactionType: "MobileWallet",
          amount: "1",
          currency: "KES",
          remarks: "Exellient",
          timestamp: `${Date.now()}`,
          bankCode: "",
        },
      };

      const stkResponse = await storeApi.stkPush(payload);
      const statusCheckPayload: statusPayload = {
        requestId: payload.destination.requestId,
        transactionId: stkResponse.transactionId,
      };

      // Set up the interval for status checking
      const timer = setInterval(() => {
        storeApi
          .statusManagement(statusCheckPayload)
          .then((statusResponse: StatusResponse) => {
            console.log(statusResponse);

            if (statusResponse.statusDesc === "FAILED") {
              toast.error(
                `Payment failed for request ${statusResponse.requestId}`
              );
              clearInterval(timer);
              setIsSubmitting(false);
            } else if (statusResponse.statusDesc === "COMPLETE") {
              clearInterval(timer);
              setIsSubmitting(false);
              toast.success(
                `Payment of KES ${statusResponse.amount} processed successfully. 
            Request ID: ${statusResponse.requestId}`
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, 1000); // Check every 1 second

      // Timeout to stop polling after a specified period (initialCountdown)
      setTimeout(() => {
        clearInterval(timer);
        setIsSubmitting(false);
        toast.warning("Payment confirmation timed out");
      }, 1000 * 60); // Timeout after 1 minute (this could be adjusted to your `initialCountdown`)
    } catch (error) {
      console.error("Payment Error:", error);
      setIsSubmitting(false);
    }
  };

  // Handle card form submission
  const handleCardSubmit = (values: CardFormValues) => {
    setIsSubmitting(true);
    setCardInfo(values);

    // Prepare cart data
    const fromBuyNow = buyNow === "true";
    const buyNowCart = sessionStorage.getItem("buyNow");
    const cartItems = sessionStorage.getItem("cartItems");

    const data = {
      personalInfo,
      paymentMethod: "card",
      paymentDetails: {
        cardNumber: values.cardNumber,
        cardExpiry: values.cardExpiry,
        cardCvc: values.cardCvc,
      },
      cart: fromBuyNow ? buyNowCart : cartItems,
    };

    // Simulate API call
    setTimeout(() => {
      console.log("Checkout completed with Card:", data);
      setIsSubmitting(false);

      // Show success message
      window.alert("Checkout completed successfully with Card!");
    }, 1500);
  };

  // Go back to personal info step
  const handleBack = () => {
    setCurrentStep("personal");
  };

  // Payment method selector UI
  const renderPaymentMethodSelector = () => {
    return (
      <div className="mb-6">
        <Suspense fallback={<div>Loading...</div>}></Suspense>
        <div className="grid grid-cols-2 gap-4 items-start sm:w-full md:w-[80%]">
          <div
            className={`border-2 py-3 px-2 rounded-md cursor-pointer ${
              paymentMethod === "mpesa" ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => handlePaymentMethodChange("mpesa")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">M-Pesa</p>
                </div>
              </div>
              {paymentMethod === "mpesa" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
          </div>

          <div
            className={`border-2 py-3 px-2 rounded-md cursor-pointer ${
              paymentMethod === "card" ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => handlePaymentMethodChange("card")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Card</p>
                </div>
              </div>
              {paymentMethod === "card" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                <h1 className="text-lg">
                  {currentStep === "personal"
                    ? "Personal Information"
                    : "Payment Details"}
                </h1>
              </CardTitle>
              <span className="text-sm text-gray-500">
                Step {currentStep === "personal" ? "1/2" : "2/2"}
              </span>
            </div>
            <CardDescription>
              {currentStep === "personal"
                ? "Please provide your contact details"
                : "Select your preferred payment method"}
            </CardDescription>
          </CardHeader>
          <Separator />

          {currentStep === "personal" && (
            <PersonalInfoForm
              initialValues={personalInfo || undefined}
              onSubmit={handlePersonalInfoSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === "payment" && (
            <>
              <CardContent className="pt-6">
                {renderPaymentMethodSelector()}
              </CardContent>

              {paymentMethod === "mpesa" ? (
                <MpesaForm
                  initialValues={mpesaInfo}
                  onSubmit={handleMpesaSubmit}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <CardForm
                  initialValues={cardInfo}
                  onSubmit={handleCardSubmit}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
