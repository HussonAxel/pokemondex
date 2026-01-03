import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeTypesProps {
  pokemonTypes: string[];
  className?: string;
  classNameBadge?: string;
}

// Mapping des types vers les classes Tailwind
const typeClassMap: Record<
  string,
  { bg: string; text: string; border: string; hover: string }
> = {
  normal: {
    bg: "bg-gray-400/10",
    text: "text-gray-400",
    border: "border-gray-400/20",
    hover: "hover:bg-gray-400/20",
  },
  fire: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    hover: "hover:bg-orange-500/20",
  },
  water: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    hover: "hover:bg-blue-500/20",
  },
  electric: {
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    border: "border-yellow-400/20",
    hover: "hover:bg-yellow-400/20",
  },
  grass: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
    hover: "hover:bg-green-500/20",
  },
  ice: {
    bg: "bg-cyan-300/10",
    text: "text-cyan-300",
    border: "border-cyan-300/20",
    hover: "hover:bg-cyan-300/20",
  },
  fighting: {
    bg: "bg-red-600/10",
    text: "text-red-500",
    border: "border-red-600/20",
    hover: "hover:bg-red-600/20",
  },
  poison: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    hover: "hover:bg-purple-500/20",
  },
  ground: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    hover: "hover:bg-amber-500/20",
  },
  flying: {
    bg: "bg-indigo-300/10",
    text: "text-indigo-300",
    border: "border-indigo-300/20",
    hover: "hover:bg-indigo-300/20",
  },
  psychic: {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/20",
    hover: "hover:bg-pink-500/20",
  },
  bug: {
    bg: "bg-lime-500/10",
    text: "text-lime-400",
    border: "border-lime-500/20",
    hover: "hover:bg-lime-500/20",
  },
  rock: {
    bg: "bg-yellow-600/10",
    text: "text-yellow-500",
    border: "border-yellow-600/20",
    hover: "hover:bg-yellow-600/20",
  },
  ghost: {
    bg: "bg-purple-600/10",
    text: "text-purple-400",
    border: "border-purple-600/20",
    hover: "hover:bg-purple-600/20",
  },
  dragon: {
    bg: "bg-violet-600/10",
    text: "text-violet-400",
    border: "border-violet-600/20",
    hover: "hover:bg-violet-600/20",
  },
  dark: {
    bg: "bg-gray-700/10",
    text: "text-gray-400",
    border: "border-gray-700/20",
    hover: "hover:bg-gray-700/20",
  },
  steel: {
    bg: "bg-slate-400/10",
    text: "text-slate-300",
    border: "border-slate-400/20",
    hover: "hover:bg-slate-400/20",
  },
  fairy: {
    bg: "bg-pink-300/10",
    text: "text-pink-300",
    border: "border-pink-300/20",
    hover: "hover:bg-pink-300/20",
  },
};

const getTypeClasses = (type: string) => {
  const typeLower = type.toLowerCase();
  return (
    typeClassMap[typeLower] || {
      bg: "bg-gray-400/10",
      text: "text-gray-400",
      border: "border-gray-400/20",
      hover: "hover:bg-gray-400/20",
    }
  );
};

export default function BadgeTypes({
  pokemonTypes,
  className,
  classNameBadge,
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
              "px-2 py-0.5",
              "text-[10px] uppercase tracking-wider font-bold",
              "shadow-sm backdrop-blur-md",
              typeClasses.bg,
              typeClasses.text,
              typeClasses.border,
              typeClasses.hover,
              classNameBadge
            )}
          >
            {type}
          </Badge>
        );
      })}
    </div>
  );
}
