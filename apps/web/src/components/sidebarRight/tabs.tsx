import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import BreedingComponent from "@/components/sidebarRight/breeding";
import MovePoolComponent from "@/components/sidebarRight/move-pool";
import OverviewComponent from "@/components/sidebarRight/overview";
import SpritesComponent from "@/components/sidebarRight/sprites";
import TrainingRelationsComponent from "@/components/sidebarRight/training-relations";

type TabsComponentProps = {
  onSelectSprite: (src: string, alt: string) => void;
  selectedSpriteSrc: string | null;
};

export default function TabsComponent({
  onSelectSprite,
  selectedSpriteSrc,
}: TabsComponentProps) {
  return (
    <Tabs className="flex h-full min-h-0 flex-col" defaultValue="tab-1">
      <div className="shrink-0 border-b">
        <TabsList
          variant="underline"
          className="flex w-full flex-wrap items-center justify-center gap-2 border-t border-sidebar-border px-2"
        >
          <TabsTab value="tab-1">Overview</TabsTab>
          <TabsTab value="tab-2">Breeding</TabsTab>
          <TabsTab value="tab-3">Training & Relations</TabsTab>
          <TabsTab value="tab-4">Sprites</TabsTab>
          <TabsTab value="tab-5">Move Pool</TabsTab>
        </TabsList>
      </div>
      <TabsPanel className="min-h-0" value="tab-1">
        <OverviewComponent />
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-2">
        <BreedingComponent />
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-3">
        <TrainingRelationsComponent />
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-4">
        <SpritesComponent
          onSelectSprite={onSelectSprite}
          selectedSpriteSrc={selectedSpriteSrc}
        />
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-5">
        <MovePoolComponent />
      </TabsPanel>
    </Tabs>
  );
}
