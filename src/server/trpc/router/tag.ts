import slugify from "slugify";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { tagFormSchema } from "../../../components/TagForm";
import { TRPCError } from "@trpc/server";

export const tagRouter = router({
  createTag: protectedProcedure
    .input(tagFormSchema)
    .mutation(
      async ({ ctx: { prisma, session }, input: { description, name } }) => {
        const tag = await prisma.tag.findUnique({
          where: {
            name,
          },
        });

        if (tag) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Tag Name Already Exists",
          });
        }
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
