"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardBoard() {
  const { data: session } = useSession();

  const router = useRouter();

  const handlePanel = () => {
    router.push("/panel");
  };

  return (
    <div className="w-full">
      <h1 className="text-center text-2xl">Welcome to your Dashboard</h1>
      <p>Witaj, {session?.user?.name}</p>
      <p> Przejdź do swojego panelu użytkownika </p>
      <button
        className="bg-stone-900 text-white rounded-xl px-4 py-2"
        onClick={handlePanel}
      >
        Przejdź dalej
      </button>
    </div>
  );
}
