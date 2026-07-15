import { lazy, Suspense, useState } from "react";

import Loader from "@/components/demo/loader";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { orpc } from "@/utils/orpc";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, BookOpen, Dna, Images, Swords } from "lucide-react";
import { usePokemonDetailId } from "./pokemon-detail-context";

const PokedexProfile = lazy(
  () => import("@/components/sidebarRight/pokedex-profile"),
);
const BreedingComponent = lazy(
  () => import("@/components/sidebarRight/breeding"),
);
const TrainingRelationsComponent = lazy(
  () => import("@/components/sidebarRight/training-relations"),
);
const SpritesComponent = lazy(
  () => import("@/components/sidebarRight/sprites"),
);
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
  const pokemonId = usePokemonDetailId();
  const queryClient = useQueryClient();

  const prefetchMovePool = () => {
    void loadMovePoolComponent();
    void queryClient.prefetchQuery({
      ...orpc.getPokemonMoveData.queryOptions({ input: { id: pokemonId } }),
      staleTime: 24 * 60 * 60 * 1000,
    });
  };

  return (
    <Tabs
      className="flex h-full min-h-0 flex-col gap-0"
      defaultValue="tab-1"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <nav
        aria-label="Pokemon profile sections"
        className="shrink-0 border-b bg-card px-2 md:px-5"
      >
        <TabsList
          variant="underline"
          className="scrollbar-hide flex w-full flex-nowrap items-center justify-start gap-1 overflow-x-auto py-2"
        >
          <TabsTab className="h-10 grow-0 px-3.5" value="tab-1">
            <BookOpen />
            Pokédex
          </TabsTab>
          <TabsTab className="h-10 grow-0 px-3.5" value="tab-2">
            <Activity />
            Training
          </TabsTab>
          <TabsTab className="h-10 grow-0 px-3.5" value="tab-3">
            <Dna />
            Breeding
          </TabsTab>
          <TabsTab
            className="h-10 grow-0 px-3.5"
            onMouseEnter={prefetchMovePool}
            value="tab-4"
          >
            <Swords />
            Moves
          </TabsTab>
          <TabsTab className="h-10 grow-0 px-3.5" value="tab-5">
            <Images />
            Gallery
          </TabsTab>
        </TabsList>
      </nav>
      <TabsPanel className="min-h-0 overflow-y-auto" value="tab-1">
        {activeTab === "tab-1" ? (
          <Suspense fallback={<Loader />}>
            <PokedexProfile />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-y-auto" value="tab-2">
        {activeTab === "tab-2" ? (
          <Suspense fallback={<Loader />}>
            <TrainingRelationsComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-y-auto" value="tab-3">
        {activeTab === "tab-3" ? (
          <Suspense fallback={<Loader />}>
            <BreedingComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-y-auto" value="tab-4">
        {activeTab === "tab-4" ? (
          <Suspense fallback={<Loader />}>
            <MovePoolComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0 overflow-y-auto" value="tab-5">
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
