"use client";

import { useSession } from "next-auth/react";
import ProfileEditForm from "./_components/profileEdit";

export default function Dashboard() {

  const { data: session } = useSession();
  const email = session?.user?.email;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-pacifico mb-5">Welcome to your Profile Panel</h1>
      <ProfileEditForm email={email ?? ''}/>
    </div>
  );
}
