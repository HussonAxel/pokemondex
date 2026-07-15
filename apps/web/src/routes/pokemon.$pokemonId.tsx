import MainTab from "@/components/sidebarRight/mainTab";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";
import {
  createFileRoute,
  notFound,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/pokemon/$pokemonId")({
  loader: async ({ context, params }) => {
    const pokemonId = Number(params.pokemonId);
    if (!Number.isInteger(pokemonId) || pokemonId <= 0) throw notFound();

    const pokemon = await context.queryClient.ensureQueryData(
      orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    );

    if (pokemon.species?.url) {
      await context.queryClient.ensureQueryData(
        orpc.getPokemonSpeciesData.queryOptions({
          input: { url: pokemon.species.url },
        }),
      );
    }

    return { pokemonId };
  },
  component: PokemonDetailPage,
});

function PokemonDetailPage() {
  const { pokemonId } = Route.useLoaderData();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const returnToPokedex = () => {
    if (canGoBack) {
      router.history.back();
      return;
    }

    router.navigate({ to: "/" });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            aria-label="Back to Pokedex"
            size="icon"
            variant="ghost"
            onClick={returnToPokedex}
          >
            <ArrowLeft />
          </Button>
          <div className="min-w-0 border-l border-border pl-3">
            <p className="truncate text-sm font-semibold text-foreground">
              Pokemon Explorer
            </p>
            <p className="truncate text-xs text-muted-foreground">
              National Pokedex
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="hidden text-[10px] font-medium uppercase text-muted-foreground sm:inline">
            Profile
          </span>
          <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
            #{pokemonId.toString().padStart(4, "0")}
          </span>
        </div>
      </header>
      <main className="min-h-0 w-full flex-1 overflow-hidden">
        <MainTab pokemonId={pokemonId} />
      </main>
    </div>
  );
}
