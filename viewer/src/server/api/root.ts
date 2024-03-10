import { createTRPCRouter } from "@/server/api/trpc";

import { jsonRouter } from "./routers/json";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  json: jsonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
