"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserCard } from "./userCard";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <UserCard user={session?.user} />
        <button
          onClick={() => signOut()}
          type="button"
          className="bg-blue-500 px-4 py-2 rounded-sm text-white"
        >
          Sign Out
        </button>
      </>
    );
  } else {
    return (
      <>
        <button
          onClick={() => signIn()}
          type="button"
          className="bg-blue-500 px-4 py-2 rounded-sm text-white"
        >
          Sign In with Google
        </button>
      </>
    );
  }
}
