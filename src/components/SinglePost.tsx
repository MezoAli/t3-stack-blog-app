import { BsBookmarkHeart, BsBookmarkCheck } from "react-icons/bs";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import type { RouterOutputs } from "../utils/trpc";
import TopicsTags from "./TopicsTags";
import { useState } from "react";

dayjs.extend(relativeTime);

type PostProps = RouterOutputs["post"]["getAllPosts"][number];

const SinglePost = ({ ...post }: PostProps) => {
  const postRoute = trpc.useContext().post;
  const userRoute = trpc.useContext().user;
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(post.bookmarks.length)
  );

  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
      postRoute.getReadingList.invalidate();
      userRoute.getSuggessions.invalidate();
    },
  });

  const unbookmarkPost = trpc.post.unbookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
      postRoute.getReadingList.invalidate();
      userRoute.getSuggessions.invalidate();
    },
  });
  return (
    <div
      key={post.id}
      className="flex flex-col border-b border-gray-300 last:border-none"
    >
      <>
        <div className="mb-4 flex w-full items-center justify-start gap-x-4">
          {post.author.image && post.author.name && (
            <Image
              src={post.author.image}
              alt={post.author.name}
              className="rounded-full"
              // fill
              width={40}
              height={40}
            />
          )}
          <div>
            <div className="flex gap-x-1 font-semibold">
              <Link
                href={`/user/${post.author.username}`}
                className="cursor-pointer decoration-slate-800 hover:underline"
              >
                {post.author.name} .
              </Link>
              <p>{dayjs(post.createdAt).fromNow()}</p>
            </div>
            <p className="text-sm text-gray-500">Pharmacist</p>
          </div>
        </div>
        <Link href={`/${post.slug}`}>
          <div className="grid min-h-[150px] w-full grid-cols-12 gap-4">
            <div className="col-span-8 flex flex-col gap-y-3">
              <p className="text-2xl font-bold text-gray-800 decoration-indigo-800 hover:underline">
                {post.title}
              </p>
              <p className="break-words text-sm text-gray-500">
                {post.description}
              </p>
            </div>
            <div className="col-span-4">
              <div className="relative h-full w-full rounded-lg bg-gray-400 transition hover:scale-105 hover:shadow-xl">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </Link>
      </>
      <div className="my-4 flex items-center justify-between">
        <TopicsTags justify="justify-start" topics={false} tags={post.tags} />
        {isBookmarked ? (
          <div
            className="cursor-pointer text-red-500"
            onClick={() => unbookmarkPost.mutate({ postId: post.id })}
          >
            <BsBookmarkCheck size={24} />
          </div>
        ) : (
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => bookmarkPost.mutate({ postId: post.id })}
          >
            {bookmarkPost.isLoading ? (
              <p>loading...</p>
            ) : (
              <BsBookmarkHeart size={24} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
