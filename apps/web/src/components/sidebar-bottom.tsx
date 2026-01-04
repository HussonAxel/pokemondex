import { useNavigate, useSearch } from "@tanstack/react-router";
import { Sparkles, LucideBalloon } from "lucide-react";
import { Route } from "@/routes/index";

export const SidebarBottom = () => {
  const navigate = useNavigate({ from: Route.id });
  const searchParams = useSearch({ from: Route.id });
  const page = searchParams.page ?? 1;
  return (
    <div className="w-full mx-auto h-[48px] border-t border-border items-center px-4 flex flex-row gap-2 justify-between">
      <p className="text-sm text-accent-foreground/80 font-normal">
        1025 Pokémons
      </p>

      <div className="flex flex-row gap-4">
        <span className="inline-flex items-center justify-center">
          <Sparkles
            className={`w-4 h-4 cursor-pointer transition-all duration-300 ${
              searchParams.shinyView
                ? "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                : "text-yellow-500/50"
            }`}
            onClick={() => {
              navigate({
                search: {
                  ...searchParams,
                  shinyView: !searchParams.shinyView,
                },
              });
            }}
          />
        </span>
        <span className="inline-flex items-center justify-center">
          <LucideBalloon
            className={`w-4 h-4 cursor-pointer transition-all duration-300 ${
              searchParams.catchedView
                ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                : "text-red-500/50"
            }`}
            onClick={() => {
              navigate({
                search: {
                  ...searchParams,
                  catchedView: !searchParams.catchedView,
                },
              });
            }}
          />
        </span>
      </div>
    </div>
  );
};
