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
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(post.bookmarks.length)
  );

  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      console.log("done created");
      setIsBookmarked((prev) => !prev);
    },
  });

  const unbookmarkPost = trpc.post.unbookmarkPost.useMutation({
    onSuccess: () => {
      console.log("done deleted");
      setIsBookmarked((prev) => !prev);
    },
  });
  return (
    <div
      key={post.id}
      className="group flex flex-col border-b border-gray-300 last:border-none"
    >
      <Link href={`/${post.slug}`}>
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
            <p className="font-semibold">
              {post.author.name} . {dayjs(post.createdAt).fromNow()}
            </p>
            <p className="text-sm text-gray-500">Pharmacist</p>
          </div>
        </div>
        <div className="grid w-full grid-cols-12 gap-4">
          <div className="col-span-8 flex flex-col gap-y-3">
            <p className="text-2xl font-bold text-gray-800 decoration-indigo-800 group-hover:underline">
              {post.title}
            </p>
            <p className="break-words text-sm text-gray-500">
              {post.description}
            </p>
          </div>
          <div className="col-span-4">
            <div className="h-full w-full rounded-lg bg-gray-400 transition hover:scale-105 hover:shadow-xl" />
          </div>
        </div>
      </Link>
      <div className="my-4 flex items-center justify-between">
        <TopicsTags justify="justify-start" topics={false} />
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