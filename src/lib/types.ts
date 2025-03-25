export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  salePrice: number;
  originalPrice: number;
  discount?: number;
  currentStock: number;
  category?: string;
  rating?: number;
  options?: {
    colour?: string[];
    size?: string[];
  };
  features?: string[];
  specifications?: Record<string, string>;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  customer: {
    name: string;
    email: string;
    phone: string;
    merchantId: string;
  };
  shipping: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    method: string;
    trackingNumber?: string;
  };
  payment: {
    method: string;
    last4?: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  items: CartItem[];
}
