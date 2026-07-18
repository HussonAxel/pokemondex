import { Link } from "@tanstack/react-router";
import { HouseIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PokemonBreadcrumbProps {
  pokemonId: number;
  pokemonName: string;
}

export function PokemonBreadcrumb({
  pokemonId,
  pokemonName,
}: PokemonBreadcrumbProps) {
  const pokemonNumber = pokemonId.toString().padStart(4, "0");

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap gap-1 text-[11px] sm:text-xs">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="inline-flex h-7 items-center gap-1.5 rounded-[4px] px-1.5 font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            render={<Link to="/" />}
          >
            <HouseIcon className="size-3.5 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">Pokemon Explorer</span>
            <span className="sr-only sm:hidden">Pokemon Explorer</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-muted-foreground/50 [&>svg]:size-3" />
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbLink
            className="inline-flex h-7 items-center rounded-[4px] px-1.5 font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            render={<Link to="/" />}
          >
            National Pokedex
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden text-muted-foreground/50 sm:list-item [&>svg]:size-3" />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="flex h-7 max-w-[min(52vw,24rem)] min-w-0 items-center rounded-[4px] border bg-background/70 px-2 font-semibold shadow-xs sm:max-w-[32rem]">
            <span className="truncate">
              {pokemonName} #{pokemonNumber}
            </span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
