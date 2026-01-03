import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import InfosComponent from "@/components/sidebar--right/infos";

export default function TabsComponent() {
  return (
    <Tabs defaultValue="tab-1">
      <div className="border-b">
        <TabsList
          variant="underline"
          className="flex flex-row gap-2 px-2 border-t border-sidebar-border flex-wrap justify-center items-center w-full"
        >
          <TabsTab value="tab-1">Overview</TabsTab>
          <TabsTab value="tab-2">Breeding</TabsTab>
          <TabsTab value="tab-3">Training & Relations</TabsTab>
          <TabsTab value="tab-4">Sprites</TabsTab>
          <TabsTab value="tab-5">Move Pool</TabsTab>
        </TabsList>
      </div>
      <TabsPanel value="tab-1">
        <InfosComponent />
      </TabsPanel>
      <TabsPanel value="tab-2">
        <p className="p-4 text-center text-muted-foreground text-xs">
          Tab 2 content
        </p>
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
