"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { Header } from "./Header";
import { AnnouncementBar } from "./AnnouncementBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AnnouncementBar />
        <Header />
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
