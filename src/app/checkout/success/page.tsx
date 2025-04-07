import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your order has been placed and payment has been processed
            successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your email address.
            </p>
            <p className="text-sm text-gray-500">
              Your order will be processed shortly.
            </p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50 mt-6">
            <h3 className="font-medium text-sm mb-2">Order Reference</h3>
            <p className="text-lg font-mono font-semibold">
              ORD-{Math.floor(100000 + Math.random() * 900000)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-1/2 h-10 bg-theme-color">
            <Link href="/orders">View Your Orders</Link>
          </Button>
          <Button variant="outline" asChild className="w-1/2 h-10">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
