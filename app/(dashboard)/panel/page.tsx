"use client";

import { useSession } from "next-auth/react";
import { UserPanel } from "./_components/userPanel";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();

  // Sprawdź, czy użytkownik nie jest zalogowany
  if (status === "unauthenticated") {
    redirect("/");
  }

  // Sprawdź, czy sesja się ładuje
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl">Welcome to your Profile Panel</h1>
      <UserPanel />
    </div>
  );
}
