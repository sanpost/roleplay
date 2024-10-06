"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function MarketingPage() {
  const { data: session } = useSession();

  if (session) {
    redirect("/board");
  }

  return (
    <div className="flex flex-col items-center justify-center text-neutral-800 bg-neutral-100/70 py-20 px-10 rounded-3xl shadow-xl">
      <h1 className="text-5xl font-bold mb-10 animate-fadeIn font-pacifico">Welcome to Roleplay!</h1>
      <p className="text-xl mb-6">Discover roleplay enthusiasts with similar literary interests.</p>
      <div className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Why is it worth it?</h2>
        <ul className="list-none list-inside">
          <li>
            <span>★</span> Find people with similar literary interests.
          </li>
          <li>
            <span>★</span> Engage in various roleplay sessions.
          </li>
          <li>
            <span>★</span> Create your own stories and characters.
          </li>
          <li>
            <span>★</span> Connect with others in interactive groups.
          </li>
        </ul>
      </div>
    </div>
  );
  
};
