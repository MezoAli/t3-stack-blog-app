import slugify from "slugify";
import { formSchema } from "../../../components/ModalForm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

const LIMIT = 5;

export const postRouter = router({
  createPost: protectedProcedure
    .input(
      formSchema.and(
        z.object({
          tagsId: z.array(z.object({ id: z.string() })),
        })
      )
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { description, text, title, tagsId, html },
      }) => {
        await prisma.post.create({
          data: {
            title,
            description,
            text,
            html,
            slug: slugify(title),
            author: {
              connect: {
                id: session.user.id,
              },
            },
            tags: {
              connect: tagsId,
            },
          },
        });
      }
    ),

  getAllPosts: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { cursor } }) => {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
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
            },
          },
          bookmarks: {
            where: {
              userId: session?.user?.id,
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: LIMIT + 1,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > LIMIT) {
        const nextItem = posts.pop();
        if (nextItem) {
          nextCursor = nextItem.id;
        }
      }
      return { posts, nextCursor };
    }),

  getSinglePost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { slug } }) => {
      const post = await prisma.post.findUnique({
        where: {
          slug,
        },
        select: {
          title: true,
          description: true,
          text: true,
          id: true,
          html: true,
          authorId: true,
          featuredImage: true,
          comments: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          likes: session?.user?.id
            ? {
                where: {
                  userId: session?.user?.id,
                },
              }
            : false,
        },
      });

      return post;
    }),

  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });
    }),

  dislikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id,
          },
        },
      });
    }),

  bookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });
    }),

  unbookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.delete({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id,
          },
        },
      });
    }),

  commentPost: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        postId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { comment, postId } }) => {
        await prisma.comment.create({
          data: {
            text: comment,
            userId: session.user.id,
            postId,
          },
        });
      }
    ),

  getReadingList: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const readingList = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          post: {
            select: {
              title: true,
              slug: true,
              description: true,
              createdAt: true,
              featuredImage: true,
              id: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      return readingList;
    }
  ),

  updatePostFeaturedImage: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma }, input: { imageUrl, postId } }) => {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          featuredImage: imageUrl,
        },
      });
    }),
});
