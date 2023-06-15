import Header from "./Header";

const MainLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default MainLayout;
