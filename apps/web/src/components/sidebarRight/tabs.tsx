import { lazy, Suspense, useRef, useState } from "react";

import Loader from "@/components/demo/loader";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { orpc } from "@/utils/orpc";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, BookOpen, Dna, Images, Swords } from "lucide-react";
import { usePokemonDetailId } from "./pokemon-detail-context";

const PokedexProfile = lazy(
  () => import("@/components/sidebarRight/pokedex-profile"),
);
const loadBreedingComponent = () =>
  import("@/components/sidebarRight/breeding");
const BreedingComponent = lazy(loadBreedingComponent);
const loadTrainingRelationsComponent = () =>
  import("@/components/sidebarRight/training-relations");
const TrainingRelationsComponent = lazy(loadTrainingRelationsComponent);
const loadSpritesComponent = () =>
  import("@/components/sidebarRight/sprites");
const SpritesComponent = lazy(loadSpritesComponent);
const loadMovePoolComponent = () =>
  import("@/components/sidebarRight/move-pool");
const MovePoolComponent = lazy(loadMovePoolComponent);

type TabsComponentProps = {
  onSelectSprite: (src: string, alt: string) => void;
  selectedSpriteSrc: string | null;
};

export default function TabsComponent({
  onSelectSprite,
  selectedSpriteSrc,
}: TabsComponentProps) {
  const [activeTab, setActiveTab] = useState("tab-1");
  const navigationRef = useRef<HTMLElement>(null);
  const pokemonId = usePokemonDetailId();
  const queryClient = useQueryClient();

  const prefetchMovePool = () => {
    void loadMovePoolComponent();
    void queryClient.prefetchQuery({
      ...orpc.getPokemonMovePoolData.queryOptions({ input: { id: pokemonId } }),
      staleTime: 24 * 60 * 60 * 1000,
    });
  };

  const prefetchTraining = () => {
    void loadTrainingRelationsComponent();
    void queryClient.prefetchQuery({
      ...orpc.getPokemonTrainingData.queryOptions({ input: { id: pokemonId } }),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchBreeding = () => {
    void loadBreedingComponent();
    void queryClient.prefetchQuery({
      ...orpc.getPokemonSpeciesSummary.queryOptions({
        input: { url: `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/` },
      }),
      staleTime: 30 * 60 * 1000,
    });
  };

  const prefetchSprites = () => {
    void loadSpritesComponent();
    void queryClient.prefetchQuery({
      ...orpc.getPokemonSpritesData.queryOptions({ input: { id: pokemonId } }),
      staleTime: 24 * 60 * 60 * 1000,
    });
  };

  const selectTab = (value: string) => {
    setActiveTab(value);
    navigationRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  };

  return (
    <Tabs
      className="flex min-h-0 flex-col gap-0 md:h-full"
      defaultValue="tab-1"
      value={activeTab}
      onValueChange={selectTab}
    >
      <nav
        ref={navigationRef}
        aria-label="Pokemon profile sections"
        className="sticky top-0 z-20 flex min-h-12 shrink-0 items-center border-y bg-background/95 px-2 backdrop-blur after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-8 after:bg-linear-to-l after:from-background after:to-transparent after:content-[''] md:static md:border-t-0 md:bg-muted/15 md:after:hidden"
      >
        <TabsList
          variant="underline"
          className="scrollbar-hide flex w-full flex-nowrap items-center justify-start gap-0.5 overflow-x-auto py-1"
        >
          <TabsTab className="h-8 grow-0 px-3" value="tab-1">
            <BookOpen />
            Pokédex
          </TabsTab>
          <TabsTab
            className="h-8 grow-0 px-3"
            onFocus={prefetchTraining}
            onMouseEnter={prefetchTraining}
            value="tab-2"
          >
            <Activity />
            Training
          </TabsTab>
          <TabsTab
            className="h-8 grow-0 px-3"
            onFocus={prefetchBreeding}
            onMouseEnter={prefetchBreeding}
            value="tab-3"
          >
            <Dna />
            Breeding
          </TabsTab>
          <TabsTab
            className="h-8 grow-0 px-3"
            onFocus={prefetchMovePool}
            onMouseEnter={prefetchMovePool}
            value="tab-4"
          >
            <Swords />
            Moves
          </TabsTab>
          <TabsTab
            className="h-8 grow-0 px-3"
            onFocus={prefetchSprites}
            onMouseEnter={prefetchSprites}
            value="tab-5"
          >
            <Images />
            Gallery
          </TabsTab>
        </TabsList>
      </nav>
      <TabsPanel className="min-h-0 overflow-visible md:overflow-y-auto" value="tab-1">
        {activeTab === "tab-1" ? (
          <Suspense fallback={<Loader />}>
            <PokedexProfile />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-visible md:overflow-y-auto" value="tab-2">
        {activeTab === "tab-2" ? (
          <Suspense fallback={<Loader />}>
            <TrainingRelationsComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-visible md:overflow-y-auto" value="tab-3">
        {activeTab === "tab-3" ? (
          <Suspense fallback={<Loader />}>
            <BreedingComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-visible md:overflow-y-auto" value="tab-4">
        {activeTab === "tab-4" ? (
          <Suspense fallback={<Loader />}>
            <MovePoolComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-visible md:overflow-y-auto" value="tab-5">
        {activeTab === "tab-5" ? (
          <Suspense fallback={<Loader />}>
            <SpritesComponent
              onSelectSprite={onSelectSprite}
              selectedSpriteSrc={selectedSpriteSrc}
            />
          </Suspense>
        ) : null}
      </TabsPanel>
    </Tabs>
  );
}
