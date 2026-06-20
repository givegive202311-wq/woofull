"use client";

import { PawIcon } from "./PawIcon";

type SectionDividerProps = {
  className?: string;
};

export function SectionDivider({ className = "" }: SectionDividerProps) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="h-px w-16 bg-primary/20" />
      <PawIcon size={20} color="#F6A54B" className="opacity-40" />
      <div className="h-px w-16 bg-primary/20" />
    </div>
  );
}
