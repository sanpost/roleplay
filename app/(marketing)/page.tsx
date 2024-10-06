"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function MarketingPage() {
  const { data: session } = useSession();

  if (session) {
    redirect("/board");
  }

  return (
    <main>
      <h1>Strona marketingowa</h1>
      {/* Zawartość dla niezalogowanych */}
    </main>
  );
}
