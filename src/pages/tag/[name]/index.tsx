import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import SinglePost from "../../../components/SinglePost";
import MainLayout from "../../../components/MainLayout";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const TagPage = () => {
  const router = useRouter();

  const posts = trpc.tag.getPostsByTag.useQuery(
    {
      name: router.query.name as string,
    },
    {
      enabled: Boolean(router.query.name as string),
    }
  );

  console.log(posts.data);

  return (
    <MainLayout>
      <div className="flex max-w-4xl flex-col items-center justify-center gap-y-3">
        <h3 className="my-4 text-2xl text-gray-700">
          Tag Name : ${router.query.name}
        </h3>
        <p className="my-4 text-xl text-gray-700">
          Posts Realated To That Tag Name
        </p>
        {posts.isLoading && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
            <div className="text-3xl">Loading ...</div>

            <AiOutlineLoading3Quarters size={30} className="animate-spin" />
          </div>
        )}
        {posts?.data &&
          posts.data?.map((post: any) => {
            return (
              <div key={post.id} className="w-[85%]">
                <SinglePost {...post} />
              </div>
            );
          })}
      </div>
    </MainLayout>
  );
};

export default TagPage;
