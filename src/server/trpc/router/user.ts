import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { username } }) => {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
          bookmarks: true,
          _count: {
            select: {
              posts: true,
            },
          },
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              createdAt: true,
              text: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
              bookmarks: true,
            },
          },
        },
      });

      return user;
    }),
});
