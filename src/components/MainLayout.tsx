import { useContext } from "react";
import Header from "./Header";
import { GlobalContext } from "../context/GlobalContextProvider";
import Modal from "./Modal";
import ModalForm from "./ModalForm";

const MainLayout = ({ children }: React.PropsWithChildren) => {
  const { isOpenModal, setIsOpenModal } = useContext(GlobalContext);

  return (
    <>
      <Header />
      {children}
      <Modal closeModal={() => setIsOpenModal(false)} isOpen={isOpenModal}>
        <ModalForm />
      </Modal>
    </>
  );
};

export default MainLayout;
