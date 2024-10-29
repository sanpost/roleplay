import { DefaultSession } from "next-auth";
import { useRouter } from "next/navigation";

export function UserCard({ user }: { user: DefaultSession["user"] }) {
  const router = useRouter();

  const handlePanel = () => {
    router.push("/panel");
  };

  return (
    <button
      onClick={handlePanel}
      className="flex items-center mr-2 bg-stone-200 hover:bg-stone-300 transition-all rounded-lg px-4 py-2"
    >
      <div className="flex flex-row gap-x-1">
        <p className="font-semibold">{user?.email}</p>
      </div>
    </button>
  );
}
