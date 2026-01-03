import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { db } from "@my-better-t-app/db";
import * as schema from "@my-better-t-app/db/schema/auth";
import { env } from "@my-better-t-app/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()]
});
