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

    await context.queryClient.ensureQueryData(
      orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    );

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
      <header className="flex h-14 shrink-0 items-center border-b px-3 sm:h-16 sm:px-6">
        <Button size="sm" variant="ghost" onClick={returnToPokedex}>
          <ArrowLeft />
          Back to Pokedex
        </Button>
      </header>
      <main className="min-h-0 w-full flex-1 overflow-hidden">
        <MainTab pokemonId={pokemonId} />
      </main>
    </div>
  );
}
