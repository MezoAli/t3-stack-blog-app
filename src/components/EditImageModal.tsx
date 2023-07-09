import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import { toast } from "react-toastify";

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

  const searchQuery = watch("searchQuery");

  const postRoute = trpc.useContext().post;

  const updateFeaturedImage = trpc.post.updatePostFeaturedImage.useMutation({
    onSuccess: () => {
      reset();
      setOpenEditImage(false);
      toast.success("Featured Image Updated Successfully");
      postRoute.getSinglePost.invalidate({ slug });
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
      {images.isLoading && (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      <div className="grid h-[600px] w-full grid-cols-3 gap-2 overflow-y-auto">
        {images.data &&
          images.data.map((item) => {
            return (
              <div
                className="relative transition hover:scale-105"
                key={item.id}
                onClick={() => {
                  setSelectedImageUrl(item.urls.full);
                }}
              >
                <Image
                  src={item.urls.thumb}
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
            onClick={() => {
              updateFeaturedImage.mutate({
                imageUrl: selectedImageUrl,
                postId,
              });
            }}
            className="my-3 w-full rounded-lg border border-gray-300 px-4 py-2
        transition hover:border-gray-700 hover:text-gray-700"
          >
            Confirm
          </button>
        </div>
      )}
    </Modal>
  );
};

export default EditImageModal;
