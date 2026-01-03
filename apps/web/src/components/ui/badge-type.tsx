import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeTypesProps {
  pokemonTypes: string[];
  className?: string;
  classNameBadge?: string;
}

// Mapping des types pour utiliser les classes CSS existantes
const typeClassMap: Record<string, string> = {
  normal: "bg-normal",
  fire: "bg-fire",
  water: "bg-water",
  electric: "bg-electric",
  grass: "bg-grass",
  ice: "bg-ice",
  fighting: "bg-fighting",
  poison: "bg-poison",
  ground: "bg-ground",
  flying: "bg-flying",
  psychic: "bg-psychic",
  bug: "bg-bug",
  rock: "bg-rock",
  ghost: "bg-ghost",
  dragon: "bg-dragon",
  dark: "bg-dark",
  steel: "bg-steel",
  fairy: "bg-fairy",
};

const getTypeClassName = (type: string): string => {
  const typeLower = type.toLowerCase();
  return typeClassMap[typeLower] || `bg-${typeLower}`;
};

export default function BadgeTypes({
  pokemonTypes,
  className,
  classNameBadge,
}: BadgeTypesProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pokemonTypes.map((type, index) => (
        <Badge
          key={`${type}-${index}`}
          variant="secondary"
          className={cn(
            getTypeClassName(type),
            "text-white font-bold text-xs uppercase",
            "px-2 py-1",
            "rounded-xl",
            "flex items-center gap-1.5",
            "shadow-sm hover:shadow-lg",
            "transition-all duration-200",
            "border-0",
            "min-h-6",
            "backdrop-blur-sm",
            classNameBadge
          )}
        >
          <img
            src={`/pkmnsTypes/${type}.svg`}
            alt={type}
            className="w-3 h-3 shrink-0"
            loading="lazy"
          />
          <span className="whitespace-nowrap tracking-wide">{type}</span>
        </Badge>
      ))}
    </div>
  );
}
