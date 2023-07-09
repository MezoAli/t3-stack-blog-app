import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import Image from "next/image";

interface EditImageProps {
  openEditImage: boolean;
  setOpenEditImage: Dispatch<SetStateAction<boolean>>;
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

  const images = trpc.unsplash.getImages.useQuery(
    {
      searchQuery: searchQuery as string,
    },
    {
      enabled: !!searchQuery,
    }
  );

  console.log(images.data);

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
      </form>
      {images.isLoading && (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      <div className="grid h-[600px] w-full grid-cols-2 gap-2 overflow-y-auto">
        {images.data &&
          images.data.map((item) => {
            return (
              <div className="relative" key={item.id}>
                <Image
                  src={item.urls.thumb}
                  alt={item.alt_description as string}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="cursor-pointer rounded-lg"
                />
              </div>
            );
          })}
      </div>
    </Modal>
  );
};

export default EditImageModal;
