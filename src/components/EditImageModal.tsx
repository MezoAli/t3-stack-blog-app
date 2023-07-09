import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import { toast } from "react-toastify";
import { useDebounce } from "../customHooks/useDebounce";

interface EditImageProps {
  openEditImage: boolean;
  setOpenEditImage: Dispatch<SetStateAction<boolean>>;
  setSelectedImageUrl: Dispatch<SetStateAction<string>>;
  selectedImageUrl: string;
  postId: string;
  slug: string;
}

interface EditImageValue {
  searchQuery: string;
}

export const editImageSchema = z.object({
  searchQuery: z.string().min(3, "characters should be at least 3 characters"),
});

const EditImageModal = ({
  openEditImage,
  setOpenEditImage,
  setSelectedImageUrl,
  selectedImageUrl,
  postId,
  slug,
}: EditImageProps) => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditImageValue>({
    resolver: zodResolver(editImageSchema),
  });

  const value = watch("searchQuery");
  const searchQuery = useDebounce(value, 3000);

  const postRoute = trpc.useContext().post;

  const updateFeaturedImage = trpc.post.updatePostFeaturedImage.useMutation({
    onSuccess: () => {
      postRoute.getSinglePost.invalidate({ slug });
      reset();
      setOpenEditImage(false);
      toast.success("Featured Image Updated Successfully");
      setSelectedImageUrl("");
    },
  });

  const images = trpc.unsplash.getImages.useQuery(
    {
      searchQuery: searchQuery as string,
    },
    {
      enabled: !!searchQuery,
    }
  );

  return (
    <Modal
      isOpen={openEditImage}
      closeModal={() => setOpenEditImage(false)}
      title="Search an Image from Unsplash"
    >
      <form>
        <input
          type="text"
          id="search"
          {...register("searchQuery")}
          className="my-4 w-full rounded-2xl border border-gray-600 p-2 pl-5 outline-none placeholder:text-gray-400"
          placeholder="search..."
        />
        {errors.searchQuery && <p>{errors?.searchQuery.message}</p>}
      </form>
      {searchQuery && images.isLoading && (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      <div className="overflow-y-scrool grid h-[600px] w-full grid-cols-3 gap-2">
        {images.data &&
          images.data.map((item) => {
            return (
              <div
                className="group relative transition"
                key={item.id}
                onClick={() => {
                  setSelectedImageUrl(item.urls.full);
                }}
              >
                <div
                  className={`absolute inset-0 z-[11] h-full w-full cursor-pointer rounded-lg
                  group-hover:bg-black/30 ${
                    selectedImageUrl === item.urls.full && "bg-black/50"
                  }`}
                ></div>
                <Image
                  src={item.urls.regular}
                  alt={item.alt_description as string}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="aspect-video cursor-pointer rounded-lg"
                />
              </div>
            );
          })}
      </div>
      {selectedImageUrl && (
        <div className="w-full">
          <button
            disabled={updateFeaturedImage.isLoading}
            onClick={() => {
              updateFeaturedImage.mutate({
                imageUrl: selectedImageUrl,
                postId,
              });
            }}
            className="my-3 w-full rounded-lg border border-gray-300 px-4 py-2
        transition hover:border-gray-700 hover:text-gray-700"
          >
            {updateFeaturedImage.isLoading ? "Submitting..." : "Confirm"}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default EditImageModal;
