import dayjs from "dayjs";
import { trpc } from "../utils/trpc";
import FollowItem from "./FollowItem";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const readingList = trpc.post.getReadingList.useQuery();

  const getFollowUsers = trpc.user.getSuggessions.useQuery();
  console.log(getFollowUsers.data);

  return (
    <aside className="col-span-4 flex h-full w-full flex-col gap-y-4 p-10">
      <div>
        <h3 className="mb-2 text-lg font-semibold">
          People You Might Be Interested In
        </h3>
        {getFollowUsers.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <p>You Have No Suggestions</p>
            <p>Start Like or Bookmark some posts 🥰😘</p>
          </div>
        )}
        {getFollowUsers?.data &&
          getFollowUsers.data.map((user) => {
            return (
              <FollowItem
                key={user.id}
                image={user.image as string}
                name={user.name as string}
                username={user.username as string}
              />
            );
          })}
      </div>
      <div className="sticky top-5">
        <h3 className="mb-2 text-lg font-semibold">Your Reading List</h3>
        {readingList.isSuccess &&
          readingList.data.map((bookmark) => {
            return (
              <Link
                href={`/${bookmark.post.slug}`}
                key={bookmark.id}
                className="group my-4 grid grid-cols-12 gap-x-2"
              >
                <div className="col-span-4">
                  <div className="relative h-full w-full rounded-lg bg-gray-300">
                    {bookmark.post.featuredImage && (
                      <Image
                        src={bookmark.post.featuredImage}
                        alt={bookmark.post.title}
                        fill
                        className="rounded-lg"
                      />
                    )}
                  </div>
                </div>
                <div className="col-span-8 flex flex-col gap-y-2">
                  <p className="text-lg font-semibold decoration-indigo-800 transition group-hover:underline ">
                    {bookmark.post.title}
                  </p>
                  <p>{bookmark.post.description}</p>
                  <div className="flex items-center gap-x-3">
                    {bookmark.post.author.name &&
                      bookmark?.post?.author?.image && (
                        <Image
                          className="rounded-full"
                          src={bookmark.post.author.image}
                          alt={bookmark.post.author.name}
                          width={30}
                          height={30}
                        />
                      )}
                    <p>{bookmark.post.author.name}</p>
                    <time>
                      {dayjs(bookmark.post.createdAt).format("DD/MM/YYYY")}
                    </time>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </aside>
  );
};

export default Sidebar;
