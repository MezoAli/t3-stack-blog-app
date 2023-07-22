import { type NextPage } from "next";
import MainLayout from "../components/MainLayout";
import Sidebar from "../components/Sidebar";
import MainSection from "../components/MainSection";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ultimate Blog App</title>
        <meta
          name="description"
          content="ultimate blog app where you can post about anything you want and 
        follow people with similar interests"
        />
      </Head>
      <MainLayout>
        <div className="flex h-screen w-full flex-col">
          <section className="grid h-full w-full grid-cols-12">
            <MainSection />
            <Sidebar />
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default Home;
