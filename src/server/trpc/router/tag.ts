import slugify from "slugify";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { tagFormSchema } from "../../../components/TagForm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

  getAllTags: publicProcedure.query(async ({ ctx: { prisma } }) => {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return tags;
  }),

  getPostsByTag: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { name } }) => {
      const posts = await prisma.post.findMany({
        where: {
          tags: {
            some: {
              name: {
                equals: name,
              },
            },
          },
        },
        select: {
          title: true,
          text: true,
          slug: true,
          createdAt: true,
          id: true,
          description: true,
          featuredImage: true,
          author: {
            select: {
              name: true,
              image: true,
              username: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          bookmarks: session?.user?.id
            ? {
                where: {
                  userId: session?.user?.id,
                },
              }
            : false,
        },
      });

      return posts;
    }),
});
