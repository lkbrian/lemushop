import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartPayload } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 402) {
      throw new Error("API quota exceeded. Please try again later.");
    }
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} ${errorText}`);
  }
  return response.json();
}

export function formatPayload(payload: CartPayload) {
  const formattedCart = payload.cart.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    unitPrice: item.salePrice,
  }));

  const totalAmount = payload.cart.reduce((total, item) => {
    return total + item.salePrice * item.quantity;
  }, 0);
  const totalDiscount = 0;

  const amount = totalAmount;
  const storeId = payload.storeId ?? 0;

  return {
    customerId: payload.customerId,
    storeId: storeId,
    amount: amount, // The total amount (without discount)
    discount: totalDiscount, // Discount value, passed as input
    totalAmount: totalAmount, // The total amount, calculated without applying discount
    cart: formattedCart, // The formatted cart items
  };
}

export function restrictInput(
  event: React.ChangeEvent<HTMLInputElement>,
  pattern: string
): void {
  const input = event.target;
  const rawValue = input.value.replace(new RegExp(pattern, "g"), "");
  input.setAttribute("data-raw", "254" + rawValue);
}

export function formatMoney(amount: number | string, currency = "USD"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
