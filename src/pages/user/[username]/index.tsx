import React, { ChangeEvent, useState } from "react";
import MainLayout from "../../../components/MainLayout";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { BiEdit } from "react-icons/bi";
import Image from "next/image";
import { BsShare } from "react-icons/bs";
import { toast } from "react-toastify";
import SinglePost from "../../../components/SinglePost";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSession } from "next-auth/react";
// import mime from "mime-types";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = trpc.user.getUser.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: Boolean(router.query.username),
    }
  );

  const userRouter = trpc.useContext().user;

  const uploadAvatar = trpc.user.uploadAvatar.useMutation({
    onSuccess: () => {
      userRouter.getUser.invalidate({
        username: router.query.username as string,
      });
      toast.success("avatar uploaded successfully");
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const [objectUrl, setObjectUrl] = useState("");
  console.log(user.data?.image);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setObjectUrl(() => URL.createObjectURL(file));

      if (file.size > 1.5 * 1000000) {
        toast.error("file size can not be greater than 1 MB");
        return;
      }

      const fr = new FileReader();

      fr.readAsDataURL(file);

      fr.onloadend = () => {
        const result = fr.result as string;
        uploadAvatar.mutate({
          imageDataURL: result,
          username: user.data?.username as string,
        });
      };
    }
    // const objectUri = URL.createObjectURL(file);
    // console.log(objectUri);
  };

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="my-10 flex h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg">
          <div className="flex w-full flex-col rounded-3xl bg-white shadow-md">
            <div className="from relative h-44 w-full rounded-3xl bg-gradient-to-r from-rose-100 to-teal-100">
              <div className="absolute -bottom-10 left-12">
                <div className="group relative h-28 w-28 cursor-pointer rounded-full border-2 border-white bg-gray-100">
                  {session?.user?.id === user.data?.id && (
                    <label
                      htmlFor="avatar"
                      className="group-hover:black/40 absolute z-10 flex h-full w-full cursor-pointer items-center
                justify-center rounded-full transition"
                    >
                      <BiEdit className="hidden text-3xl text-gray-300 group-hover:block" />
                      <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        className="sr-only"
                        accept="image/*"
                        multiple={false}
                        onChange={handleChange}
                      />
                    </label>
                  )}
                  {!objectUrl && user.data?.image && (
                    <Image
                      src={user.data.image as string}
                      alt={user.data.name as string}
                      fill
                      className="rounded-full"
                    />
                  )}
                  {objectUrl && user?.data?.name && (
                    <Image
                      src={objectUrl}
                      alt={user.data.name as string}
                      fill
                      className="rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="ml-12 mt-12 flex flex-col gap-y-2">
              <div className="text-2xl text-gray-800">{user.data?.name}</div>
              <div className="text-sm text-gray-800">
                @{user.data?.username}
              </div>
              <div className="text-sm text-gray-800">
                {user.data?._count.posts} Posts
              </div>
              <div className="mb-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("URL saved to clipboard 🎈");
                  }}
                  className="flex items-center gap-x-3 rounded-lg border border-gray-300 px-4 py-2
        transition hover:border-gray-700 hover:text-gray-700"
                >
                  <div className="cursor-pointer text-gray-600">
                    <BsShare size={22} />
                  </div>
                  <p>Share</p>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-7 flex w-full flex-col justify-center gap-y-4">
            {user.data?.posts.length === 0 && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
                <div className="text-3xl">There Is No Posts</div>
              </div>
            )}
            {user.isLoading && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
                <div className="text-3xl">Loading ...</div>

                <AiOutlineLoading3Quarters size={30} className="animate-spin" />
              </div>
            )}
            {user.data &&
              user.data.posts.map((post) => {
                return <SinglePost {...post} key={post.id} />;
              })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
