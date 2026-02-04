import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@repo/shared/lib/client";

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, onChange, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
      </div>
    );
  }
);

Select.displayName = "Select";

// EditableSelectProps는 SelectProps의 확장이 아닌 독립된 인터페이스로 정의
export interface EditableSelectProps {
  value: string;
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  setEditing?: (isEditing: boolean) => void;
  displayValue?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const EditableSelect = React.forwardRef<HTMLSelectElement, EditableSelectProps>(
  (
    { value, options, onChange, className, setEditing, displayValue, ...props },
    ref
  ) => {
    const [isEditing, onEditingChange] = React.useState(false);

    // 외부에서 편집 상태를 제어할 수 있도록 함
    React.useEffect(() => {
      if (setEditing) {
        setEditing(isEditing);
      }
    }, [isEditing, setEditing]);

    const handleClick = () => {
      onEditingChange(true);
    };

    const handleChange = (newValue: string) => {
      onChange?.(newValue);
      // 선택 즉시 에디팅 모드 종료
      setTimeout(() => {
        onEditingChange(false);
      }, 100);
    };

    // value에 해당하는 label 찾기
    const getDisplayLabel = () => {
      const selectedOption = options.find((opt) => opt.value === value);
      return displayValue || selectedOption?.label || value || "";
    };

    if (!isEditing) {
      return (
        <div
          onDoubleClick={handleClick}
          className={cn(
            "flex h-full w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-gray-50/80",
            className
          )}
        >
          {getDisplayLabel()}
        </div>
      );
    }

    return (
      <Select
        ref={ref}
        value={value}
        options={options}
        onChange={handleChange}
        className={cn("shadow-sm", className)}
        {...props}
      />
    );
  }
);

EditableSelect.displayName = "EditableSelect";

export { EditableSelect };
