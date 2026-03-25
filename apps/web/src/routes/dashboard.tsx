import { createFileRoute, redirect } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";

export async function loadDashboardData({
  queryClient,
}: {
  queryClient: { ensureQueryData: typeof import("@tanstack/react-query").QueryClient.prototype.ensureQueryData };
}) {
  try {
    return await queryClient.ensureQueryData(orpc.privateData.queryOptions());
  } catch {
    throw redirect({
      to: "/login",
    });
  }
}

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: ({ context }) => loadDashboardData({ queryClient: context.queryClient }),
});

function RouteComponent() {
  const privateData = Route.useLoaderData();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {privateData.user?.name}</p>
      <p>API: {privateData.message}</p>
    </div>
  );
}
