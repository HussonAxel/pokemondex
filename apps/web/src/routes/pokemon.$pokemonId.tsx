import MainTab from "@/components/sidebarRight/mainTab";
import { PokemonBreadcrumb } from "@/components/pokemon-breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPokemonText } from "@/components/sidebarRight/utils";
import { orpc } from "@/utils/orpc";
import {
  createFileRoute,
  notFound,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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

    return { pokemonId, pokemonName: formatPokemonText(pokemon.name) };
  },
  component: PokemonDetailPage,
});

function PokemonDetailPage() {
  const { pokemonId, pokemonName } = Route.useLoaderData();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const { resolvedTheme, setTheme } = useTheme();

  const returnToPokedex = () => {
    if (canGoBack) {
      router.history.back();
      return;
    }

    router.navigate({ to: "/" });
  };

  return (
    <main className="h-full bg-muted/25 p-2 sm:p-3">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col overflow-hidden rounded-md border bg-background shadow-sm">
        <header className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b bg-muted/15 px-3">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              aria-label="Back to Pokedex"
              size="icon-sm"
              variant="ghost"
              onClick={returnToPokedex}
            >
              <ArrowLeft />
            </Button>
            <Separator className="h-6" orientation="vertical" />
            <PokemonBreadcrumb
              pokemonId={pokemonId}
              pokemonName={pokemonName}
            />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="hidden font-mono text-[10px] uppercase text-muted-foreground md:inline">
              Profile
            </span>
            <Button
              aria-label="Change theme"
              size="icon-sm"
              variant="ghost"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              <Moon className="dark:hidden" />
              <Sun className="hidden dark:block" />
            </Button>
          </div>
        </header>
        <div
          className="min-h-0 w-full flex-1 overflow-auto overscroll-y-contain pb-[calc(1rem+env(safe-area-inset-bottom))] md:overflow-hidden md:pb-0"
          data-pokemon-detail-scroll
        >
          <MainTab pokemonId={pokemonId} />
        </div>
      </div>
    </main>
  );
}
