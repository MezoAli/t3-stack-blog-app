import slugify from "slugify";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const tagRouter = router({
  createTag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(10, "name can not be less than 10 characters"),
        description: z
          .string()
          .min(20, "description can not be less than 10 characters"),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { description, name } }) => {
        await prisma.tag.create({
          data: {
            name,
            description,
            slug: slugify(name),
          },
        });
      }
    ),
});
