import type { QueryClient } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import type { orpc } from "@/utils/orpc";

import { Toaster } from "@/components/ui/sonner";

import appCss from "../index.css?url";

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((module) => ({
        default: () => <module.TanStackRouterDevtools position="bottom-left" />,
      })),
    )
  : null;
const QueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: () => (
          <module.ReactQueryDevtools
            position="bottom"
            buttonPosition="bottom-right"
          />
        ),
      })),
    )
  : null;

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
        title: "Pokemon Explorer",
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
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="h-full overflow-hidden"><Outlet /></div>
        <Toaster richColors />
        {RouterDevtools ? (
          <Suspense fallback={null}>
            <RouterDevtools />
          </Suspense>
        ) : null}
        {QueryDevtools ? (
          <Suspense fallback={null}>
            <QueryDevtools />
          </Suspense>
        ) : null}
        <Scripts />
      </body>
    </html>
  );
}
