import { X } from "lucide-react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { Separator } from "./separator";

type FilterTagProps = {
  className?: string;
  label: string;
  onRemove?: () => void;
  value: string;
  valueClassName?: string;
  style?: CSSProperties;
};

export function FilterTag({
  className,
  label,
  onRemove,
  value,
  valueClassName,
  style,
}: FilterTagProps) {
  return (
    <button
      className={cn(
        "group flex cursor-pointer select-none items-center gap-2 rounded-md border px-2 py-1 transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97]",
        className,
      )}
      onClick={onRemove}
      style={style}
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
