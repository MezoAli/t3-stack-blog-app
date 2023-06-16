import slugify from "slugify";
import { formSchema } from "../../../components/ModalForm";
import { router, publicProcedure, protectedProcedure } from "../trpc";

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

  getAllPosts: publicProcedure.query(async ({ ctx: { prisma } }) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return posts;
  }),
});
