import React from "react";
import Login from "./login";

export const Navbar = () => {
  return (
    <nav className="top-0 px-4 w-full h-14 flex items-center">
    <h2 className="flex items-center text-2xl text-neutral-800 -ml-4 pl-20 pr-8 bg-neutral-50 rounded-r-full font-pacifico py-2">
      RolePlay
    </h2>
      <div className="ml-auto flex">
        <Login />
      </div>
    </nav>
  );
};
