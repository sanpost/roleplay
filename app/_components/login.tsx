// login.tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserCard } from "./userCard";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <UserCard user={session.user} />
        <button
          onClick={() => signOut()}
          type="button"
          className="bg-stone-600 px-4 py-2 rounded-lg text-white shadow-md"
        >
          Sign Out
        </button>
      </>
    );
  } else {
    const handleSignIn = () => {
      signIn("google", {
        callbackUrl: "http://localhost:3000/board",
        prompt: "select_account",
      });
    };

    return (
      <>
        <button
          onClick={handleSignIn}
          type="button"
          className="bg-stone-600 px-4 py-2 rounded-lg text-white shadow-md"
        >
          Sign In with Google
        </button>
      </>
    );
  }
}
