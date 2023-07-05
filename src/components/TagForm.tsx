import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface TagFormProps {
  setTagOpenModel: Dispatch<SetStateAction<boolean>>;
}

interface TagData {
  name: string;
  description: string;
}

export const tagFormSchema = z.object({
  name: z.string().min(10, "name can not be less than 10 characters"),
  description: z
    .string()
    .min(20, "description can not be less than 20 characters"),
});

const TagForm = ({ setTagOpenModel }: TagFormProps) => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<TagData>({
    resolver: zodResolver(tagFormSchema),
  });

  const createTag = trpc.tag.createTag.useMutation({
    onSuccess: () => {
      toast.success("Tag Created");
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const onSubmit = (data: TagData) => {
    createTag.mutate(data);
    reset();
    setTagOpenModel(false);
  };
  return (
    <form
      className="my-4 flex flex-col gap-y-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register("name")}
        placeholder="Name of The Tag"
        type="text"
        id="name"
        className="h-full w-full rounded-xl border border-gray-300
      p-3 outline-none placeholder:text-sm placeholder:text-gray-300 focus:border-gray-600"
      />

      <p className="mb-3 text-left text-red-600">{errors.name?.message}</p>

      <input
        {...register("description")}
        placeholder="Short Description"
        type="text"
        id="description"
        className="h-full w-full rounded-xl border border-gray-300
      p-2 outline-none placeholder:text-sm placeholder:text-gray-300 focus:border-gray-600"
      />
      <p className="mb-3 text-left text-red-600">
        {errors.description?.message}
      </p>
      <div className=" flex w-full justify-end">
        <button
          type="submit"
          className="flex items-center justify-between gap-x-3 rounded-lg border border-gray-300 px-4 py-2 text-gray-600
        transition hover:border-gray-700 hover:text-gray-900"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TagForm;
