"use client";

import { useState, useEffect } from "react";
import { Truck, X } from "lucide-react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // セッション中に閉じた場合は非表示のまま
    const dismissed = sessionStorage.getItem("woofull_announcement_dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem("woofull_announcement_dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="w-full flex items-center justify-center gap-2 py-2 px-4 text-white text-xs md:text-sm font-bold relative"
      style={{ backgroundColor: "#F6A54B" }}
    >
      <Truck size={14} className="flex-shrink-0" />
      <span>¥5,000以上のご注文で<span className="underline underline-offset-2">送料無料</span></span>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="閉じる"
      >
        <X size={14} />
      </button>
    </div>
  );
}
