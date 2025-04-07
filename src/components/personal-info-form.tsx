"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
// import { useEffect } from "react";
// import { storeApi } from "@/lib/api";

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
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9+\s-]+$/, "Invalid phone number format"),
  usePickupPoint: Yup.boolean(),
  pickupLocation: Yup.string().when("usePickupPoint", {
    is: true,
    then: (schema) => schema.required("Please select a pickup location"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export interface PersonalInfoValues {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  usePickupPoint: boolean;
  pickupLocation: string;
  middleName: string;
  merchantId: number;
}

interface PersonalInfoFormProps {
  initialValues?: PersonalInfoValues;
  onSubmit: (values: PersonalInfoValues) => void;
  isSubmitting?: boolean;
}

export function PersonalInfoForm({
  initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    usePickupPoint: false,
    pickupLocation: "",
    middleName: "",
    merchantId: 1,
  },
  onSubmit,
  isSubmitting = false,
}: PersonalInfoFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={personalInfoSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, isValid }) => (
        <Form>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName" className="mb-1 block">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="firstName"
                  name="firstName"
                  className={
                    errors.firstName && touched.firstName
                      ? "border-red-500"
                      : ""
                  }
                />
                <ErrorMessage
                  name="firstName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="mb-1 block">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="lastName"
                  name="lastName"
                  className={
                    errors.lastName && touched.lastName ? "border-red-500" : ""
                  }
                />
                <ErrorMessage
                  name="lastName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1 block">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  className={
                    errors.email && touched.email ? "border-red-500" : ""
                  }
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mobileNumber" className="mb-1 block">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="mobileNumber"
                  name="mobileNumber"
                  className={
                    errors.mobileNumber && touched.mobileNumber
                      ? "border-red-500"
                      : ""
                  }
                />
                <ErrorMessage
                  name="mobileNumber"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
            <Field type="hidden" name="middleName" />
            <Field type="hidden" name="merchantId" />
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
                <Label htmlFor="usePickupPoint">Select a pickup point</Label>
              </div>

              {values.usePickupPoint && (
                <div className="mt-4">
                  <Label htmlFor="pickupLocation" className="mb-1 block">
                    Pickup Location <span className="text-red-500">*</span>
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
                        errors.pickupLocation && touched.pickupLocation
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
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="bg-theme-color ml-auto cursor-pointer"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </CardFooter>
        </Form>
      )}
    </Formik>
  );
}
