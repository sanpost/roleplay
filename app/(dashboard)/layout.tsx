"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "../_components/navbar";
import { redirect } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div
          className="w-full flex-grow flex m-auto px-20 mt-14 overflow-hidden"
        >
          <div className="flex-1 overflow-auto pt-5 pb-10">{children}</div>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/");
  }
};

export default DashboardLayout;
