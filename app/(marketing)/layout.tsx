'use client';

import { useSession } from "next-auth/react";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";
import { redirect } from "next/navigation";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <div
        className="h-screen w-full bg-cover items-center flex flex-col justify-between"
        style={{ backgroundImage: "url('/wallpaper.jpg')" }}
      >
        <Navbar />
        <div>{children}</div>
        <Footer />
      </div>
    );
  }

  if (session) {
    redirect("/board");
  }
};

export default MarketingLayout;
