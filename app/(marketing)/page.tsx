"use client";

export default function MarketingPage() {

  return (
    <div className="flex flex-col items-center justify-center text-neutral-800 bg-neutral-100/70 py-20 px-10 rounded-3xl shadow-xl">
      <h1 className="text-5xl mb-10 animate-fadeIn font-pacifico">
        Welcome to Roleplay!
      </h1>
      <p className="text-xl mb-6">
        Discover roleplay enthusiasts with similar literary interests.
      </p>
      <div className="mt-8">
        <h2 className="text-3xl font-pacifico mb-4 text-center">
          Why is it worth it?
        </h2>
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
}
