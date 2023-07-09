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
      const images = await serverApi.search.getPhotos({
        query: searchQuery,
        orientation: "landscape",
        orderBy: "relevant",
      });

      return images.response?.results;
    }),
});
