"use client";

import { CartProvider } from "@/hooks/useCart";
import { Header } from "./Header";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
    </CartProvider>
  );
}
