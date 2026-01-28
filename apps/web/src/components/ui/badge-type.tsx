import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeTypesProps {
  pokemonTypes: string[];
  className?: string;
  classNameBadge?: string;
  onClick?: (e: React.MouseEvent, type: string) => void;
}

// Mapping des types vers les classes Tailwind
const typeClassMap: Record<
  string,
  { bg: string; border: string; hover: string }
> = {
  normal: {
    bg: "bg-gray-200/50 dark:bg-gray-600/50",
    border: "border-gray-600 border-[0.5px]",
    hover: "hover:bg-gray-300/50",
  },
  fire: {
    bg: "bg-orange-500/30",
    border: "border-orange-600",
    hover: "hover:bg-orange-600/50",
  },
  water: {
    bg: "bg-blue-500/30",
    border: "border-blue-600",
    hover: "hover:bg-blue-600/30",
  },
  electric: {
    bg: "bg-yellow-600/30",
    border: "border-yellow-700",
    hover: "hover:bg-yellow-700/30",
  },
  grass: {
    bg: "bg-green-500/30",
    border: "border-green-600",
    hover: "hover:bg-green-600/30",
  },
  ice: {
    bg: "bg-cyan-400/30",
    border: "border-cyan-500",
    hover: "hover:bg-cyan-500/30",
  },
  fighting: {
    bg: "bg-red-600/30",
    border: "border-red-700",
    hover: "hover:bg-red-700/30",
  },
  poison: {
    bg: "bg-purple-600/20",
    border: "border-purple-700",
    hover: "hover:bg-purple-600/20",
  },
  ground: {
    bg: "bg-amber-300/30",
    border: "border-amber-400",
    hover: "hover:bg-amber-400/30",
  },
  flying: {
    bg: "bg-indigo-300/30",
    border: "border-indigo-400",
    hover: "hover:bg-indigo-400/30",
  },
  psychic: {
    bg: "bg-pink-500/30",
    border: "border-pink-600",
    hover: "hover:bg-pink-600/30",
  },
  bug: {
    bg: "bg-lime-500/30",
    border: "border-lime-600",
    hover: "hover:bg-lime-600/30",
  },
  rock: {
    bg: "bg-amber-700/30",
    border: "border-amber-800",
    hover: "hover:bg-amber-800/30",
  },
  ghost: {
    bg: "bg-purple-700/50",
    border: "border-purple-800",
    hover: "hover:bg-purple-800/50",
  },
  dragon: {
    bg: "bg-violet-600/30",
    border: "border-violet-700",
    hover: "hover:bg-violet-700/30",
  },
  dark: {
    bg: "bg-gray-700/30",
    border: "border-gray-800",
    hover: "hover:bg-gray-800/30",
  },
  steel: {
    bg: "bg-slate-400/30",
    border: "border-slate-700",
    hover: "hover:bg-slate-500/30",
  },
  fairy: {
    bg: "bg-pink-300/30",
    border: "border-pink-400",
    hover: "hover:bg-pink-400/30",
  },
};

const getTypeClasses = (type: string) => {
  const typeLower = type.toLowerCase();
  return (
    typeClassMap[typeLower] || {
      bg: "bg-gray-200/50 dark:bg-gray-600/50",
      border: "border-gray-600 border-[0.5px]",
      hover: "hover:bg-gray-300/50",
    }
  );
};

export default function BadgeTypes({
  pokemonTypes,
  className,
  classNameBadge,
  onClick,
}: BadgeTypesProps) {
  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {pokemonTypes.map((type, index) => {
        const typeClasses = getTypeClasses(type);
        return (
          <Badge
            key={`${type}-${index}`}
            variant="secondary"
            className={cn(
              "whitespace-nowrap",
              "inline-flex items-center",
              "transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "border",
              "px-2 py-2",
              "text-[10px] uppercase tracking-wider font-bold",
              typeClasses.bg,
              typeClasses.text,
              typeClasses.border,
              typeClasses.hover,
              classNameBadge,
            )}
            onClick={onClick ? (e) => onClick(e, type) : undefined}
          >
            {type}
          </Badge>
        );
      })}
    </div>
  );
}
