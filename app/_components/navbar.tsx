import React from "react";
import Login from "./login";

export const Navbar = () => {
  return (
    <nav className="top-0 px-4 w-full h-14 flex items-center">
    <span className="flex items-center text-2xl text-neutral-800 font-serif -ml-4 pl-20 pr-8 bg-neutral-50 rounded-r-full">
      RolePlay
    </span>
      <div className="ml-auto flex">
        <Login />
      </div>
    </nav>
  );
};
