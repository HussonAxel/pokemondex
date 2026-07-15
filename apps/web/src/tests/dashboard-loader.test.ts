import { loadDashboardData } from "@/routes/dashboard";

describe("loadDashboardData", () => {
  it("redirects to /login when the private query fails", async () => {
    const queryClient = {
      ensureQueryData: vi.fn().mockRejectedValue(new Error("unauthorized")),
    };

    await expect(loadDashboardData({ queryClient })).rejects.toMatchObject({
      to: "/login",
    });
    expect(queryClient.ensureQueryData).toHaveBeenCalledTimes(1);
  });

  it("hydrates dashboard data with a single query", async () => {
    const privateData = {
      message: "This is private",
      user: { id: "user-1", name: "Axel" },
    };
    const queryClient = {
      ensureQueryData: vi.fn().mockResolvedValue(privateData),
    };

    await expect(loadDashboardData({ queryClient })).resolves.toEqual(privateData);
    expect(queryClient.ensureQueryData).toHaveBeenCalledTimes(1);
  });
});
