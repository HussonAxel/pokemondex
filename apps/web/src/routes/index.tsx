import { createFileRoute } from "@tanstack/react-router";
import { SidebarTop } from "@/components/sidebar-top";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="flex flex-col h-full">
      <SidebarTop />
      <Grid />
    </div>
  );
}

function Grid({ itemCount = 30, columns = 6 }) {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const rows = Math.ceil(itemCount / columns);

  return (
    <div
      className="grid gap-2 p-2 flex-1 overflow-auto"
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)` 
      }}
    >
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center justify-center rounded-lg bg-blue-500 text-white"
        >
          {item}
        </div>
      ))}
    </div>
  );
}