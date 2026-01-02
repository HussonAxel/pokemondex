import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";

export const SidebarTop = () => {
  return (
    <div className="w-full h-[64px] bg-sidebar border-b border-border items-center px-8 flex flex-row gap-2">
      <ChevronLeft className="w-6 h-6 opacity-40 cursor-pointer hover:opacity-100 transition-opacity" />
      <ChevronRight className="w-6 h-6 opacity-40 cursor-pointer hover:opacity-100 transition-opacity" />
      <div className="flex flex-row gap-1 rounded-lg bg-sidebar-accent p-1 items-center justify text-center">
        <Link
          to="/"
          search={{ view: "grid" }}
          className="p-1 rounded-md transition-all duration-300 opacity-40 hover:opacity-80"
          activeProps={{
            className:
              "text-primary bg-blue-100/20 opacity-100 rounded-sm transition-all duration-300",
          }}
        >
          <LayoutGrid className="w-4 h-4" />
        </Link>
        <Separator
          className="w-px h-4 bg-border opacity-60 self-center!"
          orientation="vertical"
        />
        <Link
          to="/"
          search={{ view: "list" }}
          className="p-1 rounded-md transition-all duration-300 opacity-40 hover:opacity-80"
          activeProps={{
            className:
              "text-primary bg-blue-100/20 opacity-100 rounded-sm transition-all duration-300",
          }}
        >
          <List className="w-4 h-4" />
        </Link>
      </div>

      <p className="text-sm text-sidebar-foreground">
        Je suis un test pour voir si le sidebar top est bien en place
      </p>
    </div>
  );
};
