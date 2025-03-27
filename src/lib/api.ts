// lib/api.ts
import { Category, statusPayload, StkPayload } from "./types";
import { handleApiResponse } from "./utils";

const API_BASE_URL = "https://paymentsapi.lemuapps.com/lemu/api/v1";

const headers = {
  "Content-Type": "application/json",
  "Lemu-Platform-TenantId": "lemu",
};

// Utility functions for store operations
export const storeUtils = {
  // Check if in production
  isProduction:
    typeof window !== "undefined"
      ? window.location.hostname !== "localhost" &&
        !window.location.hostname.startsWith("127.0.0.")
      : true,

  // Get subdomain from any URL
  getSubdomain: (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      const parts = hostname.split(".");

      if (parts.length <= 2) return null;
      return parts.slice(0, parts.length - 2).join(".");
    } catch (e) {
      console.error("Invalid URL", e);
      return null;
    }
  },

  // Get current subdomain with local override
  getCurrentSubdomain: (): string => {
    if (typeof window === "undefined") return "nexor"; // Default for SSR

    if (!storeUtils.isProduction) {
      return "nexor"; // Hardcoded subdomain for local
    }

    const subdomain = storeUtils.getSubdomain(window.location.href);
    return subdomain || "nexor"; // Fallback to 'tech' if no subdomain found
  },
};

// API functions for store operations
export const storeApi = {
  // Get store information
  getStoreInfo: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sub-domain/store/details/${storeUtils.getCurrentSubdomain()}`,
        { headers }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching store info:", error);
      throw error;
    }
  },

  // Get all merchant products
  getMerchantProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/product/getAll`, {
        headers,
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching merchant products:", error);
      throw error;
    }
  },

  // Get store products by store ID
  getStoreProducts: async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/product/store/${id}`, {
        headers,
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching store products:", error);
      throw error;
    }
  },

  // Get single product by ID
  getSingleProduct: async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/product/view/${id}`, {
        headers,
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Create customer
  createCustomer: async (payload: unknown) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  // Create order
  createOrder: async (payload: unknown) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/order/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  stkPush: async (payload: StkPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  statusManagement: async (payload: statusPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/status`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching store orders:", error);
      throw error;
    }
  },
  // Get all store orders
  getStoreOrders: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shop/order/getAll?storeId=1`,
        { headers }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching store orders:", error);
      throw error;
    }
  },

  // Get all merchant store orders
  getMerchantStoreOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/order/getAll`, {
        headers,
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching merchant orders:", error);
      throw error;
    }
  },

  // Get store order by ID
  getStoreOrderById: async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/order/find/${id}`, {
        headers,
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },
  filterProducts: async (query: string, selectedCategories: Category[]) => {
    try {
      const categoryParams = selectedCategories
        .map((c) => `category=${c.id}`)
        .join("&");
      const url = `${API_BASE_URL}/shop/product/store/1?filter=${query}&${categoryParams}`;
      const response = await fetch(url, { headers });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error;
    }
  },
};
