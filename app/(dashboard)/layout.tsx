"use client";

import { useSession } from "next-auth/react";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";
import { redirect } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div
          className="flex-grow flex m-auto px-20 overflow-hidden"
        >
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    redirect("/");
  }
};

export default DashboardLayout;
