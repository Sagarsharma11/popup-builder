// components/TinyRoundedBadge.tsx
"use client";
import React from "react";

type Props = {
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
};

const SIZE_MAP: Record<string, { px: string; text: string; pad: string }> = {
  sm: { px: "px-3", text: "text-xs", pad: "py-1.5" },
  md: { px: "px-4", text: "text-sm", pad: "py-2" },
  lg: { px: "px-5", text: "text-base", pad: "py-2.5" },
};

export default function TinyRoundedBadge({
  label = "BUTTON",
  size = "md",
  color = "#000",
  className = "",
}: Props) {
  const s = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <div
      role="img"
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-2xl ${s.px} ${s.pad} ${s.text} font-semibold select-none transition-all duration-200 ${className}`}
      style={{
        borderWidth: 2.5,
        borderStyle: "solid",
        borderColor: color,
        color,
        background: "white",
        letterSpacing: "0.08em",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.08), inset 0 -2px 2px rgba(0,0,0,0.04)",
      }}
    >
      {label}
    </div>
  );
}
