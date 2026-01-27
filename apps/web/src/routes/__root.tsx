import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useSearch,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { orpc } from "@/utils/orpc";

import { Toaster } from "@/components/ui/sonner";

import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebarRight/SidebarRight";
import appCss from "../index.css?url";
import SidebarMobile from "@/components/sidebarRight/SidebarMobile";
export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
      },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="grid grid-cols-[auto_1fr_auto] h-full">
          <SidebarLeft />
          <div className="h-full overflow-hidden">
            <Outlet />
          </div>
          {activePokemon && (
            <div className="hidden xl:block">
              <SidebarRight />
            </div>
          )}
          <div className="block xl:hidden">
            <SidebarMobile />
          </div>
        </div>
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
