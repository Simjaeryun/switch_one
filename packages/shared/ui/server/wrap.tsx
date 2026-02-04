import { ReactNode } from "react";

interface WrapProps {
  children: ReactNode;
  className?: string;
}

export function Wrap({ children, className = "" }: WrapProps) {
  return (
    <div
      className={`mx-auto w-full min-w-[1024px] max-w-[1440px] px-4 md:px-6 ${className}`}
    >
      {children}
    </div>
  );
}
