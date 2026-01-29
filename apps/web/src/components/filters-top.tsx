import { X } from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";

export const FiltersTop = () => {
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });

  const filters = Array(15).fill({
    id: "MF-214",
    name: "Repair Context Graph",
  });

  return (
    <div className="w-full mx-auto p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-3 border border-border">
      {filters.map((filter, index) => (
        <div
          key={index}
          className="
            group flex items-center gap-2
            bg-sidebar-accent/40 hover:bg-sidebar-accent/60
            border border-transparent hover:border-border/50
            transition-all duration-200
            rounded-md pl-1.5 pr-1 py-1 text-sm
            w-full cursor-default
          "
        >
          {/* Content Container */}
          <div className="flex items-center gap-2 overflow-hidden select-none">
            {/* ID Badge: Monospace font makes it look like technical data */}
            <span className="font-mono text-[10px] font-medium text-foreground/70 bg-background/50 px-1.5 py-0.5 rounded border border-border/50 shadow-sm whitespace-nowrap">
              {filter.id}
            </span>

            {/* Divider (Visual separation) */}
            <div className="h-3 w-[1px] bg-border/60 shrink-0" />

            {/* Main Text */}
            <span className="font-medium text-foreground/90 truncate text-xs sm:text-sm">
              {filter.name}
            </span>
          </div>

          {/* Close Action: Kept separate so it never truncates */}
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
