import { useRouter } from "next/router";
import MainLayout from "../../components/MainLayout";
import { trpc } from "../../utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BiComment } from "react-icons/bi";

const PostPage = () => {
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

  return (
    <MainLayout>
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
                {post.data.likes.length > 0 ? (
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
              <div className="cursor-pointer">
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
