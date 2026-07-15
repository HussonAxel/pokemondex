import {
  getPokemonTypeStyle,
  pokemonTypeHoverClassName,
  pokemonTypeSurfaceClassName,
} from "@/lib/pokemon-type-styles";
import { cn } from "@/lib/utils";
import type { MouseEvent } from "react";

interface BadgeTypesProps {
  pokemonTypes: string[];
  className?: string;
  classNameBadge?: string;
  onClick?: (event: MouseEvent, type: string) => void;
}

export default function BadgeTypes({
  pokemonTypes,
  className,
  classNameBadge,
  onClick,
}: BadgeTypesProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {pokemonTypes.map((type, index) => {
        const typeStyle = getPokemonTypeStyle(type);
        const badgeClassName = cn(
          "inline-flex items-center whitespace-nowrap rounded-[4px] border px-4 py-2 text-[11px] font-semibold uppercase text-secondary-foreground",
          pokemonTypeSurfaceClassName,
          onClick &&
            "cursor-pointer transition-[background-color,border-color,transform] duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          onClick && pokemonTypeHoverClassName,
          classNameBadge,
        );

        return onClick ? (
          <button
            key={`${type}-${index}`}
            type="button"
            className={badgeClassName}
            style={typeStyle}
            onClick={(event) => onClick(event, type)}
          >
            {type}
          </button>
        ) : (
          <span
            key={`${type}-${index}`}
            className={badgeClassName}
            style={typeStyle}
          >
            {type}
          </span>
        );
      })}
    </div>
  );
}
