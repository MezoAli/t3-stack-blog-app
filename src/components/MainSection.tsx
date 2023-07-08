import { BiChevronDown } from "react-icons/bi";
import Search from "./Search";
import TopicsTags from "./TopicsTags";
import { trpc } from "../utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import SinglePost from "./SinglePost";

const MainSection = () => {
  const posts = trpc.post.getAllPosts.useQuery();

  return (
    <main className="col-span-8 h-full w-full border-r border-gray-300 px-10 py-10">
      <div className="mb-5 flex w-full flex-col space-y-4">
        <div className="flex w-full gap-x-4">
          <Search />
          <TopicsTags justify="justify-end" topics={true} />
        </div>
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-10">
          <div>Articles</div>
          <button className="flex items-center justify-center gap-x-2 rounded-full border border-gray-300 px-3 py-1.5 font-semibold transition hover:bg-gray-600 hover:text-white">
            <div>Following</div>
            <div>
              <BiChevronDown />
            </div>
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center gap-y-4">
        {posts.data?.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
            <div className="text-3xl">There Is No Posts</div>
          </div>
        )}
        {posts.isLoading && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
            <div className="text-3xl">Loading ...</div>

            <AiOutlineLoading3Quarters size={30} className="animate-spin" />
          </div>
        )}
        {posts.data &&
          posts.data.map((post) => {
            return <SinglePost {...post} key={post.id} />;
          })}
      </div>
    </main>
  );
};

export default MainSection;
