import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import GlobalContextProvider from "../context/GlobalContextProvider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ToastContainer />
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
