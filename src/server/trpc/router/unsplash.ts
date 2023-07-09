import { TRPCError } from "@trpc/server";
import { editImageSchema } from "../../../components/EditImageModal";
import { env } from "../../../env/server.mjs";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { createApi } from "unsplash-js";

const serverApi = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
});

export const unsplashRouter = router({
  getImages: protectedProcedure
    .input(editImageSchema)
    .query(async ({ ctx, input: { searchQuery } }) => {
      try {
        const images = await serverApi.search.getPhotos({
          query: searchQuery,
          orientation: "landscape",
          orderBy: "relevant",
        });

        return images.response?.results;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "unsplash api is not working",
        });
      }
    }),
});
