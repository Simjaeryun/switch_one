import { ReactNode } from "react";

interface WrapProps {
  children: ReactNode;
  className?: string;
}

export function Wrap({ children, className = "" }: WrapProps) {
  return <div className={`w-full max-w-[1000px] ${className}`}>{children}</div>;
}
