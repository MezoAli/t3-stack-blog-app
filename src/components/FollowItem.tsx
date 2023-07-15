import Image from "next/image";
import React from "react";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface FollowItemProps {
  name: string;
  image: string;
  username: string;
  id: string;
}

const FollowItem = ({ name, image, username, id }: FollowItemProps) => {
  const { data: session } = useSession();
  const userRoute = trpc.useContext().user;

  const followuser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      toast.success("user followed successfully");
      userRoute.getAllFollowing.invalidate();
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const unFollowUser = trpc.user.unFollowUser.useMutation({
    onSuccess: () => {
      toast.success("user unfollowed successfully");
      userRoute.getAllFollowing.invalidate();
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const followings = trpc.user.getAllFollowing.useQuery({
    userId: session?.user?.id as string,
  });

  const findUser = followings.data?.following.find((user) => {
    return user.id === id;
  });

  return (
    <div className="my-4 flex flex-col gap-y-2">
      {findUser ? (
        <div className="flex items-center justify-between gap-x-1">
          <div className="relative mr-2 h-8 w-8 flex-none rounded-full bg-gray-500">
            <Image src={image} alt={name} fill className="rounded-full" />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className=" break-words text-sm text-gray-500">{username}</p>
          </div>

          <button
            onClick={() => unFollowUser.mutate({ followUserId: id })}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-gray-700 transition hover:border-gray-600"
          >
            UnFollow
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-x-1">
          <div className="relative mr-2 h-8 w-8 flex-none rounded-full bg-gray-500">
            <Image src={image} alt={name} fill className="rounded-full" />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className=" break-words text-sm text-gray-500">{username}</p>
          </div>

          <button
            onClick={() => followuser.mutate({ followUserId: id })}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-gray-700 transition hover:border-gray-600"
          >
            Follow
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowItem;
