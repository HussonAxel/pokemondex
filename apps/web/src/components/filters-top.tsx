import { X } from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";

export const FiltersTop = () => {
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });

  // Simulating your data to keep code clean
  const filters = Array(15).fill({
    id: "MF-214",
    name: "Repair Context Graph",
  });

  return (
    <div className="w-full mx-auto items-center px-1 py-2 flex flex-row gap-2 rounded-sm border border-border cursor-pointer flex-wrap">
      {filters.map((filter, index) => (
        <div
          key={index}
          className="
            flex flex-row gap-2 justify-between items-center
            bg-sidebar-accent/60 hover:bg-sidebar-accent/80 transition-colors
            rounded-[4px] px-2 py-1 text-sm
            max-w-full w-auto
          "
        >
          {/* Container for text: ensures it truncates if screen is too small */}
          <div className="flex flex-row gap-1 items-center overflow-hidden">
            <p className="font-thin opacity-60 whitespace-nowrap">
              {filter.id}
            </p>
            <p className="opacity-60">.</p>
            <p className="font-semibold opacity-80 whitespace-nowrap truncate">
              {filter.name}
            </p>
          </div>

          <X
            size={14}
            className="opacity-70 hover:bg-black/10 rounded-md cursor-pointer flex-shrink-0"
          />
        </div>
      ))}
    </div>
  );
};
