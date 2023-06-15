import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { FiLogIn } from "react-icons/fi";
import { BiDoorOpen, BiEdit } from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";
import { GlobalContext } from "../context/GlobalContextProvider";
import { useContext } from "react";

const Header = () => {
  const { data: session, status } = useSession();
  const { isOpenModal, setIsOpenModal } = useContext(GlobalContext);

  return (
    <header className=" flex h-20 w-full items-center justify-around border-b-[1px] border-gray-300 bg-white py-4">
      <div className="cursor-pointer text-gray-600">
        <GiHamburgerMenu size={22} />
      </div>
      <div className="text-2xl font-thin">Ultimate Blog App</div>
      {session ? (
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer text-gray-600">
            <BsBell size={22} />
          </div>
          <div>
            <div className="h-7 w-7 rounded-full bg-gray-400" />
          </div>
          <div>
            <button
              onClick={() => setIsOpenModal(true)}
              className="flex items-center gap-x-3 rounded-lg border border-gray-300 px-4 py-2
        transition hover:border-gray-700 hover:text-gray-700"
            >
              <div className="cursor-pointer text-gray-600">
                <BiEdit size={22} />
              </div>
              <p>Write</p>
            </button>
          </div>
          <div>
            {status === "authenticated" ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-x-3 rounded-lg border border-gray-300 px-4 py-2
        transition hover:border-gray-700 hover:text-gray-700"
              >
                <div className="cursor-pointer text-gray-600">
                  <BiDoorOpen size={22} />
                </div>
                <p>Log Out</p>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="flex items-center gap-x-3 rounded-lg border border-gray-300 px-4 py-2
        transition hover:border-gray-700 hover:text-gray-700"
        >
          <div className="cursor-pointer text-gray-600">
            <FiLogIn size={22} />
          </div>
          <p>Sign In</p>
        </button>
      )}
    </header>
  );
};

export default Header;
