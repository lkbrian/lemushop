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

export interface storeProduct {
  id: number;
  productId: number;
  storeId: number;
  name: string;
  imageUrl: string;
  productTypeId: number;
  productCategoryId: number;
  description: string;
  originalPrice: number;
  salePrice: number;
  originalStock: number;
  currentStock: number;
}

interface Pageable {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface ProductList {
  content: storeProduct[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Category {
  id: number;
  name: string;
}
export interface BuyCartItem {
  productId: number; // or number depending on how the productId is structured
  quantity: number;
  unitPrice: number;
}

export interface Payload {
  customerId: string; // or number depending on the type of customerId
  storeId: string; // or number, depending on the storeId type
  amount: number;
  discount: number;
  totalAmount: number;
  cart: CartItem[];
}
interface Attribute {
  id: number;
  colour: string;
  size: number;
  stock: number;
}

interface Options {
  colour: string[];
  size: string[];
}

export interface PayloadCartItem {
  id: number;
  name: string;
  rating: number;
  description: string;
  originalPrice: number;
  salePrice: number;
  originalStock: number;
  currentStock: number;
  images?: string[];
  attributes?: Attribute[];
  options?: Options;
  quantity: number;
}

export interface CartPayload {
  customerId: unknown;
  storeId?: unknown;
  cart: PayloadCartItem[];
}
export interface StkPayload {
  ipnEnabled: boolean;
  callbackurl: string;
  title: string;
  merchantId: string;
  source: Source;
  destination: Destination;
}

interface Source {
  countryCode: string;
  accountNumber: string;
}

interface Destination {
  requestId: string;
  accountType: string;
  countryCode: string;
  serviceType: string;
  recipientName: string;
  accountNumber: string;
  accountReference: string;
  mobileNumber: string;
  accountIssuer: string;
  transactionType: string;
  amount: string;
  currency: string;
  remarks: string;
  timestamp: string;
  bankCode: string;
}

export interface statusPayload {
  requestId: string;
  transactionId: string;
}
export interface StatusResponse {
  status: string;
  statusDesc: string;
  requestId: string;
  transactionId: string;
  amount: string;
  serviceName: string;
}
