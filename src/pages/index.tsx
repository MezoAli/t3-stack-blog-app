import { type NextPage } from "next";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Search from "../components/Search";
import TopicsTags from "../components/TopicsTags";
import MainLayout from "../components/MainLayout";
import Modal from "../components/Modal";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContextProvider";
import ModalForm from "../components/ModalForm";
import { trpc } from "../utils/trpc";
import Sidebar from "../components/Sidebar";
import dayjs from "dayjs";
import Image from "next/image";

const Home: NextPage = () => {
  const { isOpenModal, setIsOpenModal } = useContext(GlobalContext);

  const posts = trpc.post.getAllPosts.useQuery();

  return (
    <MainLayout>
      <div className="flex h-screen w-full flex-col">
        <section className="grid h-full w-full grid-cols-12">
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
              {posts.isLoading && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
                  <div className="text-3xl">Loading ...</div>

                  <AiOutlineLoading3Quarters
                    size={30}
                    className="animate-spin"
                  />
                </div>
              )}
              {posts.data &&
                posts.data.map((post) => {
                  return (
                    <div
                      key={post.id}
                      className="group flex flex-col border-b border-gray-300 last:border-none"
                    >
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
                        {/* <div className="h-10 w-10 rounded-full bg-gray-500" /> */}
                        <div>
                          <p className="font-semibold">
                            {post.author.name} .{" "}
                            {dayjs(post.createdAt).format("DD/MM/YYYY")}
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
                      <div className="my-4">
                        <TopicsTags justify="justify-start" topics={false} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </main>
          <Sidebar />
        </section>
      </div>
      <Modal closeModal={() => setIsOpenModal(false)} isOpen={isOpenModal}>
        <ModalForm />
      </Modal>
    </MainLayout>
  );
};

export default Home;
