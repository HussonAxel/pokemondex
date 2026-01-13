import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import OverviewComponent from "@/components/sidebarRight/overview";
import BreedingComponent from "@/components/sidebarRight/breeding";
import { orpc, queryClient } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";

export default function TabsComponent() {

  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${activePokemon}/`;
  const species = useQuery(orpc.getPokemonSpeciesData.queryOptions({ input: { url: pokemonSpeciesUrl } })).data;


  const prefetchGrowthRate = (url: string) => {
    const growthRateQueryOptions = orpc.getPokemonGrowthRateData.queryOptions({
      input: { url: url }
    });
    const growthRateQueryKey = growthRateQueryOptions.queryKey;
    const queryState = queryClient.getQueryState(growthRateQueryKey);
    if (!queryState || queryState.dataUpdatedAt === null) {
      queryClient.prefetchQuery({
        ...growthRateQueryOptions,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
      });
    }
  }

  return (
    <Tabs defaultValue="tab-1">
      <div className="border-b">
        <TabsList
          variant="underline"
          className="flex flex-row gap-2 px-2 border-t border-sidebar-border flex-wrap justify-center items-center w-full"
        >
          
          <TabsTab value="tab-1">Overview</TabsTab>
          <TabsTab value="tab-2" onMouseEnter={() => prefetchGrowthRate(species?.growth_rate.url)} >Breeding</TabsTab>
          <TabsTab value="tab-3">Training & Relations</TabsTab>
          <TabsTab value="tab-4">Sprites</TabsTab>
          <TabsTab value="tab-5">Move Pool</TabsTab>
        </TabsList>
      </div>
      <TabsPanel value="tab-1">
        <OverviewComponent />
      </TabsPanel>
      <TabsPanel value="tab-2">
        <BreedingComponent />
      </TabsPanel>
      <TabsPanel value="tab-3">
        <p className="p-4 text-center text-muted-foreground text-xs">
          Tab 3 content
        </p>
      </TabsPanel>
      <TabsPanel value="tab-4">
        <p className="p-4 text-center text-muted-foreground text-xs">
          Tab 4 content
        </p>
      </TabsPanel>
      <TabsPanel value="tab-5">
        <p className="p-4 text-center text-muted-foreground text-xs">
          Tab 5 content
        </p>
      </TabsPanel>
    </Tabs>
  );
}
