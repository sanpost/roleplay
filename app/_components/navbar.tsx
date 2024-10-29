import React from "react";
import Login from "./login";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();

  const handleBoard = () => {
    router.push("/board");
  };
  return (
    <nav className="top-0 px-4 w-full h-14 flex items-center">
      <button
        onClick={handleBoard}
        className="flex items-center text-2xl text-neutral-800 -ml-4 pl-20 pr-8 bg-neutral-50 rounded-r-full font-pacifico py-2"
      >
        RolePlay
      </button>
      <div className="ml-auto flex">
        <Login />
      </div>
    </nav>
  );
};
