import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils.ts";

interface SelectProps {
  value: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({
  value,
  onValueChange,
  placeholder = "Select…",
  label,
  options,
  className,
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger
          className={cn(
            "inline-flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm shadow-sm bg-white min-w-[130px]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            "data-[state=open]:border-blue-500 data-[state=open]:ring-1 data-[state=open]:ring-blue-500",
            value
              ? "border-blue-400 text-gray-900"
              : "border-gray-300 text-gray-500"
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 min-w-[8rem] rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-8 py-1.5 text-sm text-gray-700 outline-none hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:font-medium"
                >
                  <RadixSelect.ItemIndicator className="absolute left-2">
                    <Check className="h-3.5 w-3.5 text-blue-600" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
