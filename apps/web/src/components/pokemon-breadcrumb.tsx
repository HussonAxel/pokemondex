import { Link } from "@tanstack/react-router";
import { HouseIcon } from "lucide-react";

import { Frame, FramePanel } from "@/components/reui/frame";
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
    <Frame className="min-w-0" spacing="xs">
      <FramePanel fit className="px-3! py-2!">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex items-center gap-1.5"
                render={<Link to="/" />}
              >
                <HouseIcon aria-hidden="true" />
                <span className="hidden sm:inline">Pokemon Explorer</span>
                <span className="sr-only sm:hidden">Pokemon Explorer</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink render={<Link to="/" />}>
                National Pokedex
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:list-item" />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate font-semibold">
                {pokemonName} #{pokemonNumber}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </FramePanel>
    </Frame>
  );
}
