import * as React from "react";

import { cn } from "@repo/shared/lib/client";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1.5 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 read-only:bg-gray-50 read-only:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface EditableInputProps extends Omit<
  InputProps,
  "onChange" | "onBlur"
> {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  setEditing?: (isEditing: boolean) => void;
}

const EditableInput = React.forwardRef<HTMLInputElement, EditableInputProps>(
  ({ value, onChange, className, onBlur, setEditing, ...props }, ref) => {
    const [isEditing, onEditingChange] = React.useState(false);

    // 외부에서 편집 상태를 제어할 수 있도록 함
    React.useEffect(() => {
      if (setEditing) {
        setEditing(isEditing);
      }
    }, [isEditing, setEditing]);

    const handleDoubleClick = () => {
      onEditingChange?.(true);
    };

    const handleBlur = (value: any) => {
      onBlur?.(value);
      onEditingChange?.(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onBlur?.(e.currentTarget.value);
        onEditingChange?.(false);
      } else if (e.key === "Escape") {
        onEditingChange?.(false);
      }
    };

    if (!isEditing) {
      return (
        <div
          onDoubleClick={handleDoubleClick}
          className={cn(
            "flex h-full w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-gray-50",
            className
          )}
        >
          {value}
        </div>
      );
    }

    return (
      <Input
        ref={ref}
        defaultValue={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={(e) => handleBlur(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn("shadow-sm", className)}
        autoFocus
        {...props}
      />
    );
  }
);

EditableInput.displayName = "EditableInput";

export { Input, EditableInput };
