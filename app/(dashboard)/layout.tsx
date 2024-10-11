'use client';

import { useSession } from "next-auth/react";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";
import { redirect } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <div className="h-screen w-full items-center flex flex-col justify-between bg-amber-950/30">
        <Navbar />
        <div className="flex flex-grow bg-white/30 m-auto w-4/5 p-3 rounded-3xl">
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    redirect("/");;
  }

};

export default DashboardLayout;
