"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Use a ref to ensure the store is not recreated across re-renders
  const storeRef = useRef(store);
  
  return <Provider store={storeRef.current}>{children}</Provider>;
}
