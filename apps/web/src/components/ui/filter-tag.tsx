import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Separator } from "./separator";

type FilterTagProps = {
  className?: string;
  label: string;
  onRemove?: () => void;
  value: string;
  valueClassName?: string;
};

export function FilterTag({
  className,
  label,
  onRemove,
  value,
  valueClassName,
}: FilterTagProps) {
  return (
    <button
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1 border transition-all duration-200 select-none",
        className,
      )}
      onClick={onRemove}
      type="button"
    >
      <p className="font-mono text-[10px] text-foreground/80 px-1 border rounded-[2px] border-foreground/30">
        {label}
      </p>
      <Separator orientation="vertical" className="h-3" />
      <span className={cn("capitalize text-[12px] font-medium", valueClassName)}>
        {value}
      </span>
      {onRemove ? (
        <span className="p-0.5 rounded-sm opacity-60 group-hover:opacity-100">
          <X size={14} />
        </span>
      ) : null}
    </button>
  );
}
