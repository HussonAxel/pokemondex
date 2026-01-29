import { X } from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";

export const FiltersTop = () => {
  const searchParams = useSearch({ from: Route.id });

  const types = searchParams.type;
  const abilities = searchParams.ability;

  console.log(types);
  console.log(abilities);

  const filters = Array(15).fill({
    id: "MF-214",
    name: "Repair Context Graph",
  });

  return (
    <div className="w-full rounded-sm mx-auto p-2 gap-3 border border-border flex">
      {types &&
        types.map((type, index) => (
          <div
            key={index}
            className="
            group flex items-center gap-2
            bg-sidebar-accent/40 hover:bg-sidebar-accent/60
            border border-transparent hover:border-border/50
            transition-all duration-200
            rounded-md pl-1.5 pr-1 py-1 text-sm
            w-fit cursor-pointer
          "
          >
            <div className="flex items-center gap-2 overflow-hidden select-none">
              <p className="font-mono text-[10px] text-foreground/40 px-1 border-[0.5px] rounded-[2px] border-foreground/10">
                TYPE
              </p>

              <div className="h-3 w-px bg-border/60 shrink-0" />

              <span className="capitalize text-foreground/80 truncate text-[12px]">
                {type}
              </span>
            </div>

            <button
              onClick={() => console.log("remove filter")}
              className="
              flex-shrink-0 p-0.5 rounded-sm
              text-muted-foreground opacity-50
              group-hover:opacity-100 group-hover:bg-background group-hover:text-foreground
              transition-all
            "
            >
              <X size={14} />
            </button>
          </div>
        ))}
    </div>
  );
};
