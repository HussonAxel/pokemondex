import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InfosComponent() {
  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {/* Habitat Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Habitat
          </h2>
        </div>
        <div className="group relative overflow-hidden rounded-lg border border-emerald-500/20 bg-sidebar/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-emerald-500/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-emerald-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
          <p className="text-sm leading-relaxed text-foreground/90 relative z-10">
            Found in high-altitude mountain peaks or hidden caverns across the
            San Francisco region.
          </p>
        </div>
      </div>

      {/* Misc Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Misc.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="group relative flex flex-col items-center justify-center rounded-lg border border-blue-500/20 bg-sidebar/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-blue-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-blue-500/10 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Introduced
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
              Generation 1
            </p>
          </div>
          <div className="group relative flex flex-col items-center justify-center rounded-lg border border-purple-500/20 bg-sidebar/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-purple-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-purple-500/10 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Category
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
              Dragon
            </p>
          </div>
          <div className="group relative flex flex-col items-center justify-center rounded-lg border border-amber-500/20 bg-sidebar/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-amber-500/10 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Weight
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
              100kg
            </p>
          </div>
          <div className="group relative flex flex-col items-center justify-center rounded-lg border border-cyan-500/20 bg-sidebar/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-cyan-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-cyan-500/10 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Height
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
              1.0m
            </p>
          </div>
        </div>
      </div>

      {/* Abilities Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Abilities
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="group relative flex flex-col items-center justify-center rounded-lg border border-emerald-500/20 bg-sidebar/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-emerald-500/10 active:scale-[0.98] cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-br before:from-emerald-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
                  Ability
                </p>
                <p className="text-sm font-semibold text-foreground relative z-10">
                  Overgrow
                </p>
              </TooltipTrigger>
              <TooltipPopup
                className="max-w-3/4 w-fit mx-auto text-center"
                align="center"
              >
                Augmente la puissance des capacités Plante de 50% lorsque le
                Pokémon a moins d'un tiers de ses PV.
              </TooltipPopup>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="group relative flex flex-col items-center justify-center rounded-lg border border-yellow-500/20 bg-sidebar/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-yellow-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-yellow-500/10 active:scale-[0.98] cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-br before:from-yellow-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
                  Ability
                </p>
                <p className="text-sm font-semibold text-foreground relative z-10">
                  Chlorophyll
                </p>
              </TooltipTrigger>
              <TooltipPopup
                className="max-w-3/4 w-fit mx-auto text-center"
                align="center"
              >
                Double la Vitesse du Pokémon lorsque le soleil brille.
              </TooltipPopup>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="group relative flex flex-col items-center justify-center rounded-lg border border-orange-500/20 bg-sidebar/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/40 hover:bg-sidebar/70 hover:shadow-md hover:shadow-orange-500/10 active:scale-[0.98] cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
                  Ability
                </p>
                <p className="text-sm font-semibold text-foreground relative z-10">
                  Solar Power
                </p>
              </TooltipTrigger>
              <TooltipPopup
                className="max-w-3/4 w-fit mx-auto text-center"
                align="center"
              >
                Les capacités de type Plante reçoivent un bonus de 50% lorsque
                le soleil brille.
              </TooltipPopup>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
