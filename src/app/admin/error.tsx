"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-20">
      <p className="text-lg font-bold" style={{ color: "#2D2D2D" }}>管理画面でエラーが発生しました</p>
      <pre className="text-xs bg-gray-100 p-4 rounded-xl max-w-lg w-full overflow-auto" style={{ color: "#e53e3e" }}>
        {error.message}
      </pre>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full text-white text-sm font-bold"
        style={{ backgroundColor: "#F6A54B" }}
      >
        再試行
      </button>
    </main>
  );
}
