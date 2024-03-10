import fs from "fs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const LoadInputSchema = z.object({
  filename: z.string().min(1),
});

export const jsonRouter = createTRPCRouter({
  load: publicProcedure.input(LoadInputSchema).query(({ ctx, input }) => {
    try {
      const fileContents = fs.readFileSync(input.filename, "utf-8");

      const json = JSON.parse(fileContents) as { variables: unknown[] };

      return json;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
});
