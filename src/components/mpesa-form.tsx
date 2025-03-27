"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

// M-Pesa validation schema
const mpesaSchema = Yup.object({
  mpesaNumber: Yup.string()
    .required("M-Pesa number is required")
    .matches(/^[0-9+\s-]+$/, "Invalid phone number format"),
});

export interface MpesaFormValues {
  mpesaNumber: string;
}

interface MpesaFormProps {
  initialValues?: MpesaFormValues;
  onSubmit: (values: MpesaFormValues) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function MpesaForm({
  initialValues = {
    mpesaNumber: "",
  },
  onSubmit,
  onBack,
  isSubmitting = false,
}: MpesaFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={mpesaSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isValid }) => (
        <Form>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label htmlFor="mpesaNumber" className="mb-1 block">
                M-Pesa Number <span className="text-red-500">*</span>
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
                You will receive an STK push to complete the payment
              </p>
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
