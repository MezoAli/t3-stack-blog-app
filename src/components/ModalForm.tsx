import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormType = {
  title: string;
  description: string;
  body: string;
};

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "title should be at least 10 characters")
    .max(60, "title should less than 60 characters"),
  description: z
    .string()
    .min(30, "description should be at least 30 characters"),
  body: z.string().min(100, "main body should be at least 100 characters"),
});

const ModalForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });
  console.log(errors.title?.message);

  const onSubmit = (data: FormType) => {
    console.log(data);
  };
  return (
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
      <textarea
        {...register("body")}
        placeholder="Main Body"
        rows={10}
        cols={10}
        id="mainBody"
        className="h-full w-full rounded-xl border border-gray-300
      p-2 outline-none placeholder:text-sm placeholder:text-gray-300 focus:border-gray-600"
      />
      <p className="mb-3 text-left text-red-600">{errors.body?.message}</p>
      <div className=" flex w-full justify-end">
        <button
          type="submit"
          className="flex items-center gap-x-3 rounded-lg border border-gray-300 px-4 py-2 text-gray-600
        transition hover:border-gray-700 hover:text-gray-900"
        >
          Publish
        </button>
      </div>
    </form>
  );
};

export default ModalForm;
