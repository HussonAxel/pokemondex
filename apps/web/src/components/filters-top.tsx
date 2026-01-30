import { X } from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes";
import { cn } from "@/lib/utils";
import { getTypeClasses } from "@/data/data";

export const FiltersTop = () => {
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });

  const types = searchParams.type ?? [];
  const abilities = searchParams.ability ?? [];

  return (
    <div className="w-full rounded-sm mx-auto p-2 gap-3 border border-border flex flex-wrap min-h-[46px]">
      {/* TYPES */}
      {types.map((type) => {
        const colors = getTypeClasses(type);

        return (
          <div
            key={type}
            className={cn(
              "group flex items-center gap-2 rounded-md px-2 py-1",
              "border transition-all duration-200 cursor-pointer",
              colors.bg,
              colors.border,
              colors.hover,
            )}
            onClick={() =>
              navigate({
                search: {
                  ...searchParams,
                  type:
                    types.length > 1
                      ? types.filter((t) => t !== type)
                      : undefined,
                  page: 1,
                },
              })
            }
          >
            <p className="font-mono text-[10px] text-foreground/80 px-1 border rounded-[2px] border-foreground/30">
              TYPE
            </p>

            <span className="capitalize text-[12px] font-medium">{type}</span>

            <button className="p-0.5 rounded-sm opacity-60 group-hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        );
      })}

      {/* ABILITIES */}
      {abilities.map((ability) => (
        <div
          key={ability}
          className={cn(
            "group flex items-center gap-2 rounded-md px-2 py-1",
            "border transition-all duration-200",
            "bg-primary/10 border-primary/60 hover:bg-primary/20 cursor-pointer",
          )}
          onClick={() =>
            navigate({
              search: {
                ...searchParams,
                ability:
                  abilities.length > 1
                    ? abilities.filter((a) => a !== ability)
                    : undefined,
                page: 1,
              },
            })
          }
        >
          <p className="font-mono text-[10px] text-foreground/50 px-1 border rounded-[2px] border-foreground/10">
            ABILITY
          </p>

          <span className="capitalize text-[12px] font-mono">{ability}</span>

          <button className="p-0.5 rounded-sm opacity-60 group-hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
