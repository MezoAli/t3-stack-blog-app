import { type NextPage } from "next";
import Header from "../components/Header";
import { BiChevronDown } from "react-icons/bi";
import Search from "../components/Search";
import TopicsTags from "../components/TopicsTags";
import FollowItem from "../components/FollowItem";
import ReadingListItem from "../components/ReadingListItem";
import { useSession } from "next-auth/react";
import MainLayout from "../components/MainLayout";
import Modal from "../components/Modal";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContextProvider";
import ModalForm from "../components/ModalForm";

const Home: NextPage = () => {
  const { isOpenModal, setIsOpenModal } = useContext(GlobalContext);
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
              {Array.from({ length: 5 }).map((_, i) => {
                return (
                  <div
                    key={i}
                    className="group flex flex-col border-b border-gray-300 last:border-none"
                  >
                    <div className="mb-4 flex w-full items-center justify-start gap-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-500" />
                      <div>
                        <p className="font-semibold">
                          Moutaz Ali . 22 Dec. 2022
                        </p>
                        <p className="text-sm text-gray-500">Pharmacist</p>
                      </div>
                    </div>
                    <div className="grid w-full grid-cols-12 gap-4">
                      <div className="col-span-8 flex flex-col gap-y-3">
                        <p className="text-2xl font-bold text-gray-800 decoration-indigo-800 group-hover:underline">
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Laudantium, cupiditate!
                        </p>
                        <p className="break-words text-sm text-gray-500">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Cumque accusantium mollitia hic quos! Nulla,
                          dicta! Repudiandae libero autem unde odit ipsum
                          nostrum quaerat mollitia, numquam iste itaque tempora
                          ad esse.
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
          <aside className="col-span-4 flex h-full w-full flex-col gap-y-4 p-10">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                People You Might Be Interested In
              </h3>
              <FollowItem />
              <FollowItem />
              <FollowItem />
            </div>
            <div className="sticky top-5">
              <h3 className="mb-2 text-lg font-semibold">Your Reading List</h3>
              <ReadingListItem />
              <ReadingListItem />
              <ReadingListItem />
            </div>
          </aside>
        </section>
      </div>
      <Modal closeModal={() => setIsOpenModal(false)} isOpen={isOpenModal}>
        <ModalForm />
      </Modal>
    </MainLayout>
  );
};

export default Home;
