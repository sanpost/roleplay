import React from "react";
import Login from "./login";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();

  const handleBoard = () => {
    router.push("/board");
  };

  const handleProfile = () => {
    router.push("/panel");
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-14 flex items-center bg-neutral-50 shadow-md z-10 ">
      <button
        onClick={handleBoard}
        className="flex items-center text-2xl text-neutral-800 -ml-4 pl-20 pr-8 rounded-r-full font-pacifico py-2"
      >
        RolePlay
      </button>
      <div className="flex-grow flex space-x-4">
        <button
          onClick={handleBoard}
          className="text-neutral-700 text-lg py-2 px-4 rounded hover:bg-neutral-200 transition font-pacifico"
        >
          Catalog
        </button>
        <button
          onClick={handleProfile}
          className="text-neutral-700 text-lg py-2 px-4 rounded hover:bg-neutral-200 transition font-pacifico"
        >
          Your Profile
        </button>
      </div>
      <div className="ml-auto flex pr-4">
        <Login />
      </div>
    </nav>
  );
};
