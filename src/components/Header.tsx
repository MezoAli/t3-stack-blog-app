import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { FiLogIn } from "react-icons/fi";
import { BiDoorOpen, BiEdit } from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";
import { GlobalContext } from "../context/GlobalContextProvider";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();
  const { setIsOpenModal } = useContext(GlobalContext);

  return (
    <header className=" flex h-20 w-full items-center justify-around border-b-[1px] border-gray-300 bg-white py-4">
      <div className="cursor-pointer text-gray-600">
        <GiHamburgerMenu size={22} />
      </div>
      <Link href="/" className="cursor-pointer select-none text-2xl font-thin">
        Ultimate Blog App
      </Link>
      {session ? (
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer text-gray-600">
            <BsBell size={22} />
          </div>
          <div>
            {session.user?.image && session.user?.name && (
              <Image
                className="rounded-full"
                src={session.user?.image}
                alt={session.user?.name}
                width={30}
                height={30}
              />
            )}
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
