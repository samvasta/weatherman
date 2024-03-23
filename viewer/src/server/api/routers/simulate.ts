import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type SimulationResult } from "@/types/results";
import { AnyVariableSchema } from "@/types/variables/allVariables";

const SimulateInputSchema = z.object({
  model: z.object({
    variables: z.array(AnyVariableSchema),
  }),
  steps: z.number().int().positive().max(1_000),
  iterations: z.number().int().positive().max(10_000),
});

export const simulateRouter = createTRPCRouter({
  go: publicProcedure
    .input(SimulateInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await fetch(env.SIMULATOR_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = (await result.json()) as SimulationResult;
        return data;
      } catch (e) {
        throw e;
      }
    }),
});
