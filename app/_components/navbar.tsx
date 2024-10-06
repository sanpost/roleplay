import React from "react";
import Login from "./login";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm flex items-center">
      <div className="flex text-lg font-bold">RolePlay ;)</div>
      <div className="ml-auto flex">
        <Login />
      </div>
    </nav>
  );
};
