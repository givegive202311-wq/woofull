"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { useCart } from "@/hooks/useCart";
import { Menu, X, ShoppingBag } from "lucide-react";

const navLinks = [
  { href: "/products", label: "商品一覧" },
  { href: "/about", label: "ストーリー" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const useDark = !isHome || scrolled;
  const textColor = useDark ? "#2D2D2D" : "#ffffff";

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: useDark ? "rgba(255,248,241,0.95)" : "transparent",
          backdropFilter: useDark ? "blur(12px)" : "none",
          borderBottom: useDark ? "1px solid rgba(45,45,45,0.06)" : "none",
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <PawIcon
              size={22}
              color={useDark ? "#F6A54B" : "#ffffff"}
              className="transition-colors duration-500"
            />
            <span
              className="text-lg md:text-xl font-extrabold font-heading tracking-tight transition-colors duration-500"
              style={{ color: textColor }}
            >
              Woofull
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide transition-colors duration-500 hover:opacity-70"
                style={{ color: textColor }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors duration-500 hover:opacity-70"
              style={{ color: textColor }}
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: "#F6A54B" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <Link href="/cart" className="relative p-2" style={{ color: textColor }}>
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span
                  className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: "#F6A54B" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="p-2 transition-colors duration-500"
              style={{ color: textColor }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ backgroundColor: "rgba(255,248,241,0.98)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...navLinks, { href: "/cart", label: "カート" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-bold font-heading"
              style={{ color: "#2D2D2D" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </>
  );
}
