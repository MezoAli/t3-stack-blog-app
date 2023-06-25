import { useRouter } from "next/router";
import MainLayout from "../../components/MainLayout";
import { trpc } from "../../utils/trpc";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BiComment } from "react-icons/bi";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormType = {
  comment: string;
};

const commentFormSchema = z.object({
  comment: z.string().min(3, "comment should be at least 3 characters"),
});

const PostPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: zodResolver(commentFormSchema),
  });
  const [showComment, setShowComment] = useState(false);
  const router = useRouter();
  const slug: any = router.query.postSlug;
  const post = trpc.post.getSinglePost.useQuery(
    {
      slug,
    },
    {
      enabled: !!slug,
    }
  );

  const postRoute = trpc.useContext().post;

  const likePost = trpc.post.likePost.useMutation({
    onSuccess: () => {
      postRoute.getSinglePost.invalidate({ slug });
    },
  });

  const dislikePost = trpc.post.dislikePost.useMutation({
    onSuccess: () => {
      postRoute.getSinglePost.invalidate({ slug });
    },
  });

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <MainLayout>
      <Transition.Root as={Fragment} show={showComment}>
        <Dialog as="div" onClose={() => setShowComment(false)}>
          <div className="fixed right-0 top-0">
            <Transition.Child
              enter="transition duration-1000"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative h-screen w-[250px] bg-white text-black sm:w-[350px]">
                <div className="flex h-full w-full flex-col gap-y-4 overflow-y-scroll px-6 py-10 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Responses (4)</h2>
                    <AiOutlineClose
                      onClick={() => setShowComment(false)}
                      className="cursor-pointer text-xl
                     "
                    />
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-y-4 px-1 md:px-3"
                  >
                    <textarea
                      {...register("comment")}
                      placeholder="What Is In Your Mind !?"
                      rows={5}
                      id="mainBody"
                      className="h-full w-full rounded-xl border border-gray-300
      p-2 outline-none placeholder:text-sm placeholder:text-gray-300 focus:border-gray-600"
                    />
                    <p className="text-sm text-red-500">
                      {errors.comment?.message}
                    </p>
                    <button
                      type="submit"
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600
        transition hover:border-gray-700 hover:text-gray-900"
                    >
                      Comment
                    </button>
                  </form>
                  <div className="flex flex-col items-start gap-y-6">
                    <div className="w-full border-b border-gray-300 pb-3 last:border-none">
                      <div className="mb-2 flex items-center gap-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold">
                          C
                        </div>
                        <div className="flex flex-col">
                          <p>club of</p>
                          <p>15 days ago</p>
                        </div>
                      </div>
                      <p>this is fact</p>
                    </div>
                    <div className="w-full border-b border-gray-300 pb-3">
                      <div className="mb-2 flex items-center gap-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold">
                          C
                        </div>
                        <div className="flex flex-col">
                          <p>club of</p>
                          <p>15 days ago</p>
                        </div>
                      </div>
                      <p>this is fact</p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {post.isLoading && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
          <div className="text-3xl">Loading ...</div>

          <AiOutlineLoading3Quarters size={30} className="animate-spin" />
        </div>
      )}
      {!post.data && !post.isLoading && (
        <div className="flex w-full flex-col items-center justify-center gap-y-6">
          <p className="text-bold py-20 text-center text-2xl text-red-500">
            There is no post for that title
          </p>
          <Link href="/" className="font-bold text-blue-400 underline">
            Go Back To Home Page
          </Link>
        </div>
      )}
      {post.data && (
        <div className="p-15 relative flex w-full items-center justify-center p-10">
          <div className="flex w-full max-w-xl flex-col gap-y-6">
            <div className="relative h-[60vh] w-full rounded-lg bg-gray-400 shadow-xl">
              <div className="absolute flex h-full w-full items-center justify-center ">
                <div
                  className="rounded-xl bg-black p-5
            text-white opacity-50"
                >
                  {post.data?.title}
                </div>
              </div>
            </div>
            <div className="border-l-4 border-gray-700 pl-6 text-lg">
              {post.data?.description}
            </div>
            <div>{post.data?.text}</div>
          </div>
          <div className="group fixed bottom-10 flex w-full items-center justify-center">
            <div
              className="flex items-center justify-center gap-x-7 rounded-full border
             border-gray-300 bg-white p-3 opacity-90 transition hover:border-gray-600 hover:bg-gray-100 hover:opacity-100"
            >
              <div className="cursor-pointer border-r border-gray-300 pr-6 transition group-hover:border-gray-600">
                {post.data?.likes?.length > 0 ? (
                  <FcLike
                    size={26}
                    onClick={() => {
                      dislikePost.mutate({ postId: post.data?.id as string });
                    }}
                  />
                ) : (
                  <FcLikePlaceholder
                    size={26}
                    onClick={() =>
                      likePost.mutate({ postId: post.data?.id as string })
                    }
                  />
                )}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setShowComment(true)}
              >
                <BiComment size={26} />
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PostPage;
