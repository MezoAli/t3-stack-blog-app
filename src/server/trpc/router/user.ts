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
});
