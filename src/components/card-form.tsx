"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

// Card validation schema
const cardSchema = Yup.object({
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^[0-9\s]+$/, "Invalid card number format"),
  cardExpiry: Yup.string()
    .required("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid format (MM/YY)"),
  cardCvc: Yup.string()
    .required("CVC is required")
    .matches(/^[0-9]{3,4}$/, "Invalid CVC format"),
});

export interface CardFormValues {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface CardFormProps {
  initialValues?: CardFormValues;
  onSubmit: (values: CardFormValues) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function CardForm({
  initialValues = {
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  },
  onSubmit,
  onBack,
  isSubmitting = false,
}: CardFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={cardSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isValid }) => (
        <Form>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber" className="mb-1 block">
                  Card Number <span className="text-red-500">*</span>
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
                  <Label htmlFor="cardExpiry" className="mb-1 block">
                    Expiry Date <span className="text-red-500">*</span>
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
                      errors.cardCvc && touched.cardCvc ? "border-red-500" : ""
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-theme-color"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Processing..." : "Complete Checkout"}
            </Button>
          </CardFooter>
        </Form>
      )}
    </Formik>
  );
}
