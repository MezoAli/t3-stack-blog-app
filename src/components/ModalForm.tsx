import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { useContext, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { GlobalContext } from "../context/GlobalContextProvider";
import { toast } from "react-toastify";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import ComboBox from "./ComboBox";
import Modal from "./Modal";
import TagForm from "./TagForm";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

type FormType = {
  title: string;
  description: string;
  text?: string;
  html: string;
};

export interface Tag {
  id: string;
  name: string;
}

export const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "title should be at least 10 characters")
    .max(60, "title should less than 60 characters"),
  description: z
    .string()
    .min(20, "description should be at least 30 characters"),
  text: z
    .string()
    .min(100, "main body should be at least 100 characters")
    .optional(),
  html: z.string().min(50, "main body should be at least 100 characters"),
});

const ModalForm = () => {
  const { setIsOpenModal } = useContext(GlobalContext);
  const [openTagModel, setTagOpenModel] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const postRoute = trpc.useContext().post;

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("post created successfully");
      postRoute.getAllPosts.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [selectedTags, setSelctedTags] = useState<Tag[]>([]);

  const onSubmit = (data: FormType) => {
    createPost.mutate({ ...data, tagsId: selectedTags });
    setIsOpenModal(false);
    reset();
  };
  return (
    <>
      <Modal
        isOpen={openTagModel}
        closeModal={() => setTagOpenModel(false)}
        title="Create A Tag"
      >
        <TagForm setTagOpenModel={setTagOpenModel} />
      </Modal>
      <div className="mb-5 flex items-center justify-between gap-x-2">
        <div className="w-3/5 rounded-xl">
          <ComboBox
            selectedTags={selectedTags}
            setSelctedTags={setSelctedTags}
          />
        </div>
        <div>
          <button
            onClick={() => setTagOpenModel(true)}
            className="flex items-center gap-x-3 rounded-lg border border-gray-300 px-4 py-2
        transition hover:border-gray-700  hover:text-gray-700"
          >
            Create Tag
          </button>
        </div>
      </div>
      <div className="my-2 flex w-full flex-wrap gap-x-2 gap-y-2">
        {selectedTags &&
          selectedTags.map((tag) => {
            return (
              <div
                className="flex items-center justify-center gap-x-3 rounded-full bg-gray-200 px-4 py-2"
                key={tag.id}
              >
                <div>{tag.name}</div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setSelctedTags((prev) =>
                      prev.filter((taga) => taga.id !== tag.id)
                    );
                  }}
                >
                  <AiOutlineCloseCircle />
                </div>
              </div>
            );
          })}
      </div>
      <form
        className="my-4 flex flex-col gap-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("title")}
          placeholder="Title Of The Blog"
          type="text"
          id="title"
          className="h-full w-full rounded-xl border border-gray-300
      p-3 outline-none placeholder:text-sm placeholder:text-gray-300 focus:border-gray-600"
        />
        <p className="mb-3 text-left text-red-600">{errors.title?.message}</p>
        <input
          {...register("description")}
          placeholder="Short Description"
          type="text"
          id="shortDescription"
          className="h-full w-full rounded-xl border border-gray-300
      p-2 outline-none placeholder:text-sm placeholder:text-gray-300 focus:border-gray-600"
        />
        <p className="mb-3 text-left text-red-600">
          {errors.description?.message}
        </p>
        {/* <textarea
          {...register("text")}
          placeholder="Main Body"
          rows={5}
          cols={10}
          id="mainBody"
          className="h-full w-full rounded-xl border border-gray-300
      p-2 outline-none placeholder:text-sm placeholder:text-gray-300 focus:border-gray-600"
        />
        <p className="mb-3 text-left text-red-600">{errors.text?.message}</p> */}
        <Controller
          name="html"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <ReactQuill
                theme="snow"
                {...field}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                placeholder="Enter the blog details here"
              />
            </div>
          )}
        />
        <p className="mb-3 text-left text-red-600">{errors.html?.message}</p>
        <div className="flex w-full justify-end">
          <button
            disabled={createPost.isLoading}
            type="submit"
            className="flex items-center justify-between gap-x-3 rounded-lg border border-gray-300 px-4 py-2 text-gray-600
        transition hover:border-gray-700 hover:text-gray-900"
          >
            Publish
            {createPost.isLoading && (
              <AiOutlineLoading3Quarters size={30} className="animate-spin" />
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ModalForm;
