import slugify from "slugify";
import { formSchema } from "../../../components/ModalForm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { commentFormSchema } from "../../../pages/[postSlug]";

export const postRouter = router({
  createPost: protectedProcedure
    .input(formSchema)
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { description, text, title },
      }) => {
        await prisma.post.create({
          data: {
            title,
            description,
            text,
            slug: slugify(title),
            author: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
      }
    ),

  getAllPosts: publicProcedure.query(async ({ ctx: { prisma, session } }) => {
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
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        bookmarks: {
          where: {
            userId: session?.user?.id,
          },
        },
      },
    });
    return posts;
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

  // commentPost: protectedProcedure
  //   .input(
  //     z.object({
  //       comment: z.string(),
  //       postId: z.string(),
  //     })
  //   )
  //   .mutation(
  //     async ({ ctx: { prisma, session }, input: { comment, postId } }) => {
  //       await prisma.comment.create({
  //         data: {
  //           text: comment,
  //           userId: session.user.id,
  //           postId,
  //         },
  //       });
  //     }
  //   ),
});
