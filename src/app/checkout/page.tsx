"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Phone, CheckCircle2 } from "lucide-react";

// Nairobi CBD pickup points
const pickupLocations = [
  "Moi Avenue - Tuskeys Supermarket",
  "Kimathi Street - Text Book Centre",
  "Kenyatta Avenue - Sarova Stanley",
  "Tom Mboya Street - Ambassadeur Hotel",
  "Haile Selassie Avenue - Afya Centre",
  "Mama Ngina Street - Nation Centre",
  "Moi Avenue - Bazaar Plaza",
  "Koinange Street - I&M Building",
  "Kaunda Street - Electricity House",
  "Muindi Mbingu Street - Jeevanjee Gardens",
];

// Personal Info validation schema
const personalInfoSchema = Yup.object({
  personalInfo: Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobileNumber: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9+\s-]+$/, "Invalid phone number format"),
  }),
  usePickupPoint: Yup.boolean(),
  pickupLocation: Yup.string().when("usePickupPoint", {
    is: true,
    then: (schema) => schema.required("Please select a pickup location"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Payment validation schema
const paymentSchema = Yup.object({
  paymentMethod: Yup.string().required("Please select a payment method"),
  mpesaNumber: Yup.string().when("paymentMethod", {
    is: "mpesa",
    then: (schema) =>
      schema
        .required("M-Pesa number is required")
        .matches(/^[0-9+\s-]+$/, "Invalid phone number format"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardNumber: Yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) =>
      schema
        .required("Card number is required")
        .matches(/^[0-9\s]+$/, "Invalid card number format"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardExpiry: Yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) =>
      schema
        .required("Expiry date is required")
        .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid format (MM/YY)"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardCvc: Yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) =>
      schema
        .required("CVC is required")
        .matches(/^[0-9]{3,4}$/, "Invalid CVC format"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface CheckoutFormValues {
  // Personal Info
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  };
  usePickupPoint: boolean;
  pickupLocation: string;

  // Payment Info
  paymentMethod: string;
  mpesaNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<"personal" | "payment">(
    "personal"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: CheckoutFormValues = {
    // Personal Info
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
    },
    usePickupPoint: false,
    pickupLocation: "",

    // Payment Info
    paymentMethod: "mpesa",
    mpesaNumber: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  };

  const handleSubmit = (values: CheckoutFormValues) => {
    if (currentStep === "personal") {
      // Move to payment step and pre-fill mpesa number
      setCurrentStep("payment");
      return;
    }

    // Final submission
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Checkout completed:", values);
      setIsSubmitting(false);
      // Redirect to success page or show success message
      window.alert("Checkout completed successfully!");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                <h1 className="text-lg ">
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

          <Formik
            initialValues={initialValues}
            validationSchema={
              currentStep === "personal" ? personalInfoSchema : paymentSchema
            }
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              // handleChange,
              // handleBlur,
              setFieldValue,
              isValid,
            }) => {
              // Pre-fill mpesa number when moving to payment step
              if (
                currentStep === "payment" &&
                values.mpesaNumber === "" &&
                values.personalInfo.mobileNumber !== ""
              ) {
                setFieldValue("mpesaNumber", values.personalInfo.mobileNumber);
              }

              return (
                <Form>
                  <CardContent className="pt-6">
                    {currentStep === "personal" ? (
                      /* Personal Information Form */
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label
                              htmlFor="personalInfo.firstName"
                              className="mb-1 block"
                            >
                              First Name <span className="text-red-500">*</span>
                            </Label>
                            <Field
                              as={Input}
                              id="personalInfo.firstName"
                              name="personalInfo.firstName"
                              className={
                                errors.personalInfo?.firstName &&
                                touched.personalInfo?.firstName
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <ErrorMessage
                              name="personalInfo.firstName"
                              component="p"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="personalInfo.lastName"
                              className="mb-1 block"
                            >
                              Last Name <span className="text-red-500">*</span>
                            </Label>
                            <Field
                              as={Input}
                              id="personalInfo.lastName"
                              name="personalInfo.lastName"
                              className={
                                errors.personalInfo?.lastName &&
                                touched.personalInfo?.lastName
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <ErrorMessage
                              name="personalInfo.lastName"
                              component="p"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="personalInfo.email"
                              className="mb-1 block"
                            >
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Field
                              as={Input}
                              id="personalInfo.email"
                              name="personalInfo.email"
                              type="email"
                              className={
                                errors.personalInfo?.email &&
                                touched.personalInfo?.email
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <ErrorMessage
                              name="personalInfo.email"
                              component="p"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="personalInfo.mobileNumber"
                              className="mb-1 block"
                            >
                              Mobile Number{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Field
                              as={Input}
                              id="personalInfo.mobileNumber"
                              name="personalInfo.mobileNumber"
                              className={
                                errors.personalInfo?.mobileNumber &&
                                touched.personalInfo?.mobileNumber
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <ErrorMessage
                              name="personalInfo.mobileNumber"
                              component="p"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="usePickupPoint"
                              checked={values.usePickupPoint}
                              onCheckedChange={(checked) => {
                                setFieldValue("usePickupPoint", checked);
                                if (!checked) {
                                  setFieldValue("pickupLocation", "");
                                }
                              }}
                            />
                            <Label htmlFor="usePickupPoint">
                              Select a pickup point
                            </Label>
                          </div>

                          {values.usePickupPoint && (
                            <div className="mt-4">
                              <Label
                                htmlFor="pickupLocation"
                                className="mb-1 block"
                              >
                                Pickup Location{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={values.pickupLocation}
                                onValueChange={(value) =>
                                  setFieldValue("pickupLocation", value)
                                }
                              >
                                <SelectTrigger
                                  id="pickupLocation"
                                  className={
                                    errors.pickupLocation &&
                                    touched.pickupLocation
                                      ? "border-red-500"
                                      : ""
                                  }
                                >
                                  <SelectValue placeholder="Select a pickup location" />
                                </SelectTrigger>
                                <SelectContent>
                                  {pickupLocations.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <ErrorMessage
                                name="pickupLocation"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Payment Details Form */
                      <>
                        <div className="mb-6">
                          <div className="grid grid-cols-2 gap-4 items-start sm:w-full md:w-[80%]">
                            <div
                              className={`border-2 py-3 px-2 rounded-md cursor-pointer ${
                                values.paymentMethod === "mpesa"
                                  ? "border-primary"
                                  : "border-gray-200"
                              }`}
                              onClick={() =>
                                setFieldValue("paymentMethod", "mpesa")
                              }
                            >
                              <div className="">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                      <Phone className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">M-Pesa</p>
                                    </div>
                                  </div>
                                  {values.paymentMethod === "mpesa" && (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div
                              className={`border-2 py-3 px-2 rounded-md cursor-pointer ${
                                values.paymentMethod === "card"
                                  ? "border-primary"
                                  : "border-gray-200"
                              }`}
                              onClick={() =>
                                setFieldValue("paymentMethod", "card")
                              }
                            >
                              <div className="">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                      <CreditCard className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Card</p>
                                    </div>
                                  </div>
                                  {values.paymentMethod === "card" && (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <ErrorMessage
                            name="paymentMethod"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        {values.paymentMethod === "mpesa" ? (
                          <div className="mb-4">
                            <Label htmlFor="mpesaNumber" className="mb-1 block">
                              M-Pesa Number{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Field
                              as={Input}
                              id="mpesaNumber"
                              name="mpesaNumber"
                              placeholder="e.g. 254712345678"
                              className={
                                errors.mpesaNumber && touched.mpesaNumber
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <ErrorMessage
                              name="mpesaNumber"
                              component="p"
                              className="text-red-500 text-sm mt-1"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                              You will receive an STK push to complete the
                              payment
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <Label
                                htmlFor="cardNumber"
                                className="mb-1 block"
                              >
                                Card Number{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Field
                                as={Input}
                                id="cardNumber"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                className={
                                  errors.cardNumber && touched.cardNumber
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              <ErrorMessage
                                name="cardNumber"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor="cardExpiry"
                                  className="mb-1 block"
                                >
                                  Expiry Date{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Field
                                  as={Input}
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  placeholder="MM/YY"
                                  className={
                                    errors.cardExpiry && touched.cardExpiry
                                      ? "border-red-500"
                                      : ""
                                  }
                                />
                                <ErrorMessage
                                  name="cardExpiry"
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cardCvc" className="mb-1 block">
                                  CVC <span className="text-red-500">*</span>
                                </Label>
                                <Field
                                  as={Input}
                                  id="cardCvc"
                                  name="cardCvc"
                                  placeholder="123"
                                  className={
                                    errors.cardCvc && touched.cardCvc
                                      ? "border-red-500"
                                      : ""
                                  }
                                />
                                <ErrorMessage
                                  name="cardCvc"
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {currentStep === "payment" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep("personal")}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                    )}
                    <div
                      className={currentStep === "personal" ? "ml-auto" : ""}
                    >
                      <Button type="submit" disabled={isSubmitting || !isValid}>
                        {isSubmitting
                          ? "Processing..."
                          : currentStep === "personal"
                          ? "Continue to Payment"
                          : "Complete Checkout"}
                      </Button>
                    </div>
                  </CardFooter>
                </Form>
              );
            }}
          </Formik>
        </Card>
      </div>
    </div>
  );
}
