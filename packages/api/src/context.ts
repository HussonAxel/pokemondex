import { auth } from "@my-better-t-app/auth";

export async function createContext({ req }: { req?: Request }) {
  const session = req
    ? await auth.api.getSession({
        headers: req.headers,
      })
    : null;
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
