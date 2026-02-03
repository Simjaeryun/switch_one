import { ReactNode } from "react";

interface WrapProps {
  children: ReactNode;
  className?: string;
}

export function Wrap({ children, className = "" }: WrapProps) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] ${className}`}>
      {children}
    </div>
  );
}
