import { type NextPage } from "next";
import MainLayout from "../components/MainLayout";
import Sidebar from "../components/Sidebar";
import MainSection from "../components/MainSection";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <div className="flex h-screen w-full flex-col">
        <section className="grid h-full w-full grid-cols-12">
          <MainSection />
          <Sidebar />
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
