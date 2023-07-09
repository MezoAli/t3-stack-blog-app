import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditImageProps {
  openEditImage: boolean;
  setOpenEditImage: Dispatch<SetStateAction<boolean>>;
}

interface EditImageValue {
  searchQuery: boolean;
}

const editImageSchema = z.object({
  text: z.string().min(3, "characters should be at least 3 characters"),
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
          className="my-2 w-full rounded-2xl border border-gray-600 p-2 pl-5 outline-none placeholder:text-gray-400"
          placeholder="search..."
        />
      </form>
    </Modal>
  );
};

export default EditImageModal;
