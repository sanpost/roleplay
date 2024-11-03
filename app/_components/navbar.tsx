import React from "react";
import Login from "./login";
import { useRouter, usePathname } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const currentRoute = usePathname(); // Get the current path

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
          className={`text-lg py-2 px-4 rounded transition font-pacifico ${
            currentRoute === "/board"
              ? "text-neutral-900 bg-neutral-200" // Active state styles
              : "text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Catalog
        </button>
        <button
          onClick={handleProfile}
          className={`text-lg py-2 px-4 rounded transition font-pacifico ${
            currentRoute === "/panel"
              ? "text-neutral-900 bg-neutral-200" // Active state styles
              : "text-neutral-700 hover:bg-neutral-200"
          }`}
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
