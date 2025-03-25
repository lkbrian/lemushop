// contexts/store-context.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";

// Define proper interface for store data
interface StoreData {
  storeId: number;
  merchantId: number;
  storeName: string;
  description: string;
  storeCategory: string;
  welcomeMessage: string;
  phoneNumber: string;
  email: string;
  currencyId: number;
  currencyName: string;
  currencySymbol: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  customColor: string;
  logo: string;
}

interface StoreState {
  store: StoreData | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: StoreData }
  | { type: "FETCH_ERROR"; payload: string };

const initialState: StoreState = {
  store: null,
  loading: true,
  error: null,
};

const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, store: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        dispatch({ type: "FETCH_START" });

        const cachedStore = sessionStorage.getItem("storeDetails");
        if (cachedStore) {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: JSON.parse(cachedStore) as StoreData,
          });
          return;
        }

        const response = await fetch("/api/store-details");
        const data: StoreData = await response.json();

        sessionStorage.setItem("storeDetails", JSON.stringify(data));
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        // Proper error type handling
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch store details";
        dispatch({ type: "FETCH_ERROR", payload: errorMessage });
      }
    };

    fetchStoreDetails();
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
