"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";

// Nairobi areas/neighborhoods
const nairobiAreas = [
  "Westlands",
  "Kilimani",
  "Kileleshwa",
  "Lavington",
  "Karen",
  "Runda",
  "Muthaiga",
  "Parklands",
  "Gigiri",
  "Spring Valley",
  "Kitisuru",
  "Loresho",
  "Nyari",
  "Rosslyn",
  "Langata",
  "South B",
  "South C",
  "Nairobi West",
  "Madaraka",
  "Umoja",
  "Buruburu",
  "Donholm",
  "Komarock",
  "Embakasi",
  "Pipeline",
  "Utawala",
  "Kasarani",
  "Roysambu",
  "Kahawa",
  "Ruaka",
  "Ruiru",
  "Juja",
  "Thika",
  "Rongai",
  "Ngong",
  "Kiserian",
  "Athi River",
  "Kitengela",
  "CBD",
  "Eastleigh",
  "Pangani",
  "Ngara",
  "Huruma",
  "Kariobangi",
  "Dandora",
  "Kayole",
  "Githurai",
  "Zimmerman",
  "Kahawa West",
];

// Delivery address validation schema
const deliveryAddressSchema = Yup.object({
  street: Yup.string().required("Street address is required"),
  area: Yup.string().required("Area is required"),
  landmark: Yup.string(),
  buildingName: Yup.string(),
  floorAndUnit: Yup.string(),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9+\s-]+$/, "Invalid phone number format"),
});

export interface DeliveryAddressValues {
  street: string;
  area: string;
  landmark: string;
  buildingName: string;
  floorAndUnit: string;
  phoneNumber: string;
}

interface DeliveryAddressFormProps {
  initialValues?: DeliveryAddressValues;
  onSubmit: (values: DeliveryAddressValues) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export function DeliveryAddressForm({
  initialValues = {
    street: "",
    area: "",
    landmark: "",
    buildingName: "",
    floorAndUnit: "",
    phoneNumber: "",
  },
  onSubmit,
  onBack,
  isSubmitting = false,
}: DeliveryAddressFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={deliveryAddressSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, isValid }) => (
        <Form>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="street" className="mb-1 block">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="street"
                  name="street"
                  placeholder="e.g. Moi Avenue, Tom Mboya Street"
                  className={
                    errors.street && touched.street ? "border-red-500" : ""
                  }
                />
                <ErrorMessage
                  name="street"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="area" className="mb-1 block">
                  Area/Neighborhood <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.area}
                  onValueChange={(value) => setFieldValue("area", value)}
                >
                  <SelectTrigger
                    id="area"
                    className={
                      errors.area && touched.area ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select an area in Nairobi" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {nairobiAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="area"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="landmark" className="mb-1 block">
                  Landmark (Optional)
                </Label>
                <Field
                  as={Input}
                  id="landmark"
                  name="landmark"
                  placeholder="e.g. Near Afya Centre, Opposite Hilton Hotel"
                  className={
                    errors.landmark && touched.landmark ? "border-red-500" : ""
                  }
                />
                <ErrorMessage
                  name="landmark"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="buildingName" className="mb-1 block">
                  Building Name (Optional)
                </Label>
                <Field
                  as={Input}
                  id="buildingName"
                  name="buildingName"
                  placeholder="e.g. Kenyatta Towers"
                  className={
                    errors.buildingName && touched.buildingName
                      ? "border-red-500"
                      : ""
                  }
                />
                <ErrorMessage
                  name="buildingName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="floorAndUnit" className="mb-1 block">
                  Floor & Unit (Optional)
                </Label>
                <Field
                  as={Input}
                  id="floorAndUnit"
                  name="floorAndUnit"
                  placeholder="e.g. 5th Floor, Unit 502"
                  className={
                    errors.floorAndUnit && touched.floorAndUnit
                      ? "border-red-500"
                      : ""
                  }
                />
                <ErrorMessage
                  name="floorAndUnit"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="phoneNumber" className="mb-1 block">
                  Delivery Contact Phone <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="e.g. 0712345678"
                  className={
                    errors.phoneNumber && touched.phoneNumber
                      ? "border-red-500"
                      : ""
                  }
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This number will be used by the delivery person to contact you
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="ml-auto"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </CardFooter>
        </Form>
      )}
    </Formik>
  );
}
