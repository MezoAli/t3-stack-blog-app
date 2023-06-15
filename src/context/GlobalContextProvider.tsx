import { useState, createContext, SetStateAction } from "react";

type GlobalContextType = {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<SetStateAction<boolean>>;
};

export const GlobalContext = createContext<{
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<SetStateAction<boolean>>;
}>(null as any as GlobalContextType);

const GlobalContextProvider = ({ children }: React.PropsWithChildren) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <GlobalContext.Provider value={{ isOpenModal, setIsOpenModal }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
