"use client";

import React from "react";
import { cn } from "@repo/shared/lib";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  showClearButton?: boolean;
  hasValue?: boolean;
  onClear?: () => void;
}

export function Input({
  error,
  showClearButton,
  hasValue,
  onClear,
  className,
  ...props
}: InputProps) {
  const finalClassName = cn(
    "w-full rounded-md border-2 p-2 pr-8 text-sm md:p-3 md:text-base focus:outline-none",
    error
      ? "border-[#EF4444] focus:border-[#EF4444]"
      : "border-[#e6e6e6] focus:border-[#3CDC84]",
    className
  );

  return (
    <div className="relative">
      <input className={finalClassName} {...props} />
      {showClearButton && hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
