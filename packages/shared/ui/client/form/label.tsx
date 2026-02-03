import { cn } from "../../../lib/client";

export function FormLabel({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  children: React.ReactNode;
}) {
  return (
    <label className={cn("text-sm md:text-base", props.className)} {...props}>
      {children}
    </label>
  );
}
