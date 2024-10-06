"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardBoard() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Witaj, {session?.user?.name}</p>
      {/* Zawartość dashboardu */}
    </div>
  );
}
