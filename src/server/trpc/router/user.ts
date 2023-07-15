import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { decode } from "base64-arraybuffer";
import { createClient } from "@supabase/supabase-js";
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

const supabase = createClient(env.SUPABASE_PUBLIC_URL, env.SUPABSE_SERVICE_KEY);

export const userRouter = router({
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
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
              followedBy: true,
              following: true,
            },
          },
          followedBy: session?.user?.id
            ? {
                where: {
                  id: session?.user.id,
                },
              }
            : false,
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              createdAt: true,
              text: true,
              featuredImage: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true,
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
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return user;
    }),

  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageDataURL: z.string(),
        username: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { imageDataURL, username },
      }) => {
        const imageBase64Str = imageDataURL.replace(/^.+,/, "");
        const { data, error } = await supabase.storage
          .from("public")
          .upload(`avatars/${username}.png`, decode(imageBase64Str), {
            contentType: "image/png",
            upsert: true,
          });

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "can not upload avatar to db",
          });
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("public")
          .getPublicUrl(`avatars/${username}.png`);

        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            image: publicUrl,
          },
        });
      }
    ),

  getSuggessions: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const likePostTags = await prisma.like.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          post: {
            select: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const bookmarkPostTags = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          post: {
            select: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const interstedTags: string[] = [];

      likePostTags.forEach((like) => {
        interstedTags.push(...like.post.tags.map((tag) => tag.name));
      });

      bookmarkPostTags.forEach((bookmark) => {
        interstedTags.push(...bookmark.post.tags.map((tag) => tag.name));
      });

      const suggessions = await prisma.user.findMany({
        where: {
          OR: [
            {
              likes: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interstedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              bookmarks: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interstedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
          NOT: {
            id: session.user.id,
          },
        },
        select: {
          name: true,
          image: true,
          username: true,
          id: true,
        },
      });

      return suggessions;
    }
  ),

  followUser: protectedProcedure
    .input(
      z.object({
        followUserId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { followUserId } }) => {
      if (followUserId === session.user.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You Can't Follow Yourself",
        });
      }
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          following: {
            connect: {
              id: followUserId,
            },
          },
        },
      });
    }),

  unFollowUser: protectedProcedure
    .input(
      z.object({
        followUserId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { followUserId } }) => {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          following: {
            disconnect: {
              id: followUserId,
            },
          },
        },
      });
    }),

  getAllFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      const users = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followedBy: {
            select: {
              name: true,
              username: true,
              image: true,
              id: true,
              followedBy: {
                where: {
                  id: session.user.id,
                },
              },
            },
          },
        },
      });

      return users;
    }),

  getAllFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      const users = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          following: {
            select: {
              name: true,
              username: true,
              image: true,
              id: true,
            },
          },
        },
      });

      return users;
    }),
});
