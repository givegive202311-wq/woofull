"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { Header } from "./Header";
import { ShopChat } from "@/components/ui/ShopChat";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        {children}
        <ShopChat />
      </CartProvider>
    </AuthProvider>
  );
}
