// context/CartContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

// Define the CartItem type
interface CartItem {
  id: string | number;
  quantity: number;
  [key: string]: unknown; // Allow additional properties
}

// Define the CartContext type
interface CartContextType {
  cartItems: CartItem[] | null; // Allow null for initial loading
  numberOfCartItems: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: string | number) => void;
  increaseQuantity: (itemId: string | number) => void;
  decreaseQuantity: (itemId: string | number) => void;
  clearCart: () => void;
  isLoading: boolean; // Add loading state
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Derived state for the total number of items
  const numberOfCartItems = useMemo(() => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Load cart from session storage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = sessionStorage.getItem("cartItems");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart) as CartItem[];
          setCartItems(parsedCart);
        } else {
          setCartItems([]); // Initialize as empty array if no stored data
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        setCartItems([]); // Fallback to empty array on error
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    loadCart();
  }, []);

  // Save cart to session storage whenever it changes
  useEffect(() => {
    if (cartItems !== null) {
      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add item to the cart
  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      if (!prevItems) return [{ ...item, quantity: 1 } as CartItem]; // Explicitly cast as CartItem

      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 } as CartItem]; // Explicitly cast
    });
  }, []);

  // Remove item from the cart
  const removeItem = useCallback((itemId: string | number) => {
    setCartItems((prevItems) => {
      if (!prevItems) return [];
      return prevItems.filter((i) => i.id !== itemId);
    });
  }, []);

  // Increase item quantity
  const increaseQuantity = useCallback((itemId: string | number) => {
    setCartItems((prevItems) => {
      if (!prevItems) return [];
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  }, []);

  // Decrease item quantity (and remove if quantity reaches 0)
  const decreaseQuantity = useCallback((itemId: string | number) => {
    setCartItems((prevItems) => {
      if (!prevItems) return [];
      return prevItems
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0); // Remove if quantity <= 0
    });
  }, []);

  // Clear the entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
      cartItems,
      numberOfCartItems,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      isLoading,
    }),
    [
      cartItems,
      numberOfCartItems,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      isLoading,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
