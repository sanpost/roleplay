"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardBoard() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="w-full">
      <h1 className="text-center text-2xl">Welcome to your Profile Panel</h1>
      <p>Witaj, {session?.user?.name}</p>
      {/* Zawartość dashboardu */}
    </div>
  );
}
