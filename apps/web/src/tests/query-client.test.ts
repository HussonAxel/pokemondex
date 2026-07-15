import { createQueryClient } from "@/utils/orpc";

describe("createQueryClient", () => {
  it("returns isolated caches per instance", () => {
    const firstClient = createQueryClient();
    const secondClient = createQueryClient();
    const queryKey = ["privateData"];

    firstClient.setQueryData(queryKey, {
      message: "first",
      user: { id: "user-1" },
    });
    secondClient.setQueryData(queryKey, {
      message: "second",
      user: { id: "user-2" },
    });

    expect(firstClient.getQueryData(queryKey)).toEqual({
      message: "first",
      user: { id: "user-1" },
    });
    expect(secondClient.getQueryData(queryKey)).toEqual({
      message: "second",
      user: { id: "user-2" },
    });
  });
});
