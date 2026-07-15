import MainTab from "@/components/sidebarRight/mainTab";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/pokemon/$pokemonId")({
  loader: async ({ context, params }) => {
    const pokemonId = Number(params.pokemonId);
    if (!Number.isInteger(pokemonId) || pokemonId <= 0) throw notFound();

    await context.queryClient.ensureQueryData(
      orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    );

    return { pokemonId };
  },
  component: PokemonDetailPage,
});

function PokemonDetailPage() {
  const { pokemonId } = Route.useLoaderData();

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center border-b px-3 sm:h-16 sm:px-6">
        <Link
          to="/"
          className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
        >
          <ArrowLeft />
          Back to Pokedex
        </Link>
      </header>
      <main className="min-h-0 w-full flex-1 overflow-hidden">
        <MainTab pokemonId={pokemonId} />
      </main>
    </div>
  );
}
