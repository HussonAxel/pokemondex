import { lazy, Suspense, useState } from "react";

import Loader from "@/components/demo/loader";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

const OverviewComponent = lazy(() => import("@/components/sidebarRight/overview"));
const BreedingComponent = lazy(() => import("@/components/sidebarRight/breeding"));
const TrainingRelationsComponent = lazy(
  () => import("@/components/sidebarRight/training-relations"),
);
const SpritesComponent = lazy(() => import("@/components/sidebarRight/sprites"));
const MovePoolComponent = lazy(() => import("@/components/sidebarRight/move-pool"));

type TabsComponentProps = {
  onSelectSprite: (src: string, alt: string) => void;
  selectedSpriteSrc: string | null;
};

export default function TabsComponent({
  onSelectSprite,
  selectedSpriteSrc,
}: TabsComponentProps) {
  const [activeTab, setActiveTab] = useState("tab-1");

  return (
    <Tabs
      className="flex h-full min-h-0 flex-col"
      defaultValue="tab-1"
      value={activeTab}
      onValueChange={setActiveTab}
    >
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
        {activeTab === "tab-1" ? (
          <Suspense fallback={<Loader />}>
            <OverviewComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-2">
        {activeTab === "tab-2" ? (
          <Suspense fallback={<Loader />}>
            <BreedingComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-3">
        {activeTab === "tab-3" ? (
          <Suspense fallback={<Loader />}>
            <TrainingRelationsComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-4">
        {activeTab === "tab-4" ? (
          <Suspense fallback={<Loader />}>
            <SpritesComponent
              onSelectSprite={onSelectSprite}
              selectedSpriteSrc={selectedSpriteSrc}
            />
          </Suspense>
        ) : null}
      </TabsPanel>
      <TabsPanel className="min-h-0" value="tab-5">
        {activeTab === "tab-5" ? (
          <Suspense fallback={<Loader />}>
            <MovePoolComponent />
          </Suspense>
        ) : null}
      </TabsPanel>
    </Tabs>
  );
}
