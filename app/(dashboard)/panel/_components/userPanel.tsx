// UserPanel.tsx

'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 

type Profile = {
  profile_id: number;
  user_id: string;
  bio: string | null;
  age: number | null;
  avatar: string | null;
  preferences: string | null;
  age_range: string | null;
  relationship_status: string | null;
  gender: string | null;
};

export function UserPanel() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserIdAndProfile = async () => {
      if (status === 'authenticated' && session) {
        try {
          const resUserId = await fetch('/api/getUserId', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session.user?.email }), // Wysyłaj email jako body
          });

          if (!resUserId.ok) {
            throw new Error("Failed to fetch user ID");
          }

          const { user_id } = await resUserId.json();

          const resProfile = await fetch(`/api/profiles/${user_id}`);
          if (resProfile.ok) {
            const data = await resProfile.json();
            if (data.length > 0) {
              setProfile(data[0]);
            } else {
              setError("No profile found.");
            }
          } else {
            setError("Failed to load profile.");
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setLoading(false);
        }
      } else if (status === 'loading') {
        // Sesja się ładuje
      } else {
        setLoading(false);
      }
    };

    fetchUserIdAndProfile();
  }, [session, status]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-x-1 mb-4">
        <p className="font-semibold">{session?.user?.email}</p>
        <p className="font-semibold">{session?.user?.name}</p>
        <p> user ID {profile?.user_id} </p>
      </div>
      <div className="flex flex-col gap-y-2">
        <p><strong>Bio:</strong> {profile?.bio || "No bio available."}</p>
        <p><strong>Age:</strong> {profile?.age !== null ? profile?.age : "Not specified"}</p>
        <p><strong>Preferences:</strong> {profile?.preferences || "Not specified"}</p>
        <p><strong>Age Range:</strong> {profile?.age_range || "Not specified"}</p>
        <p><strong>Relationship:</strong> {profile?.relationship_status || "Not specified"}</p>
        <p><strong>Gender:</strong> {profile?.gender || "Not specified"}</p>
        {profile?.avatar ? (
          <img src={profile.avatar} alt="User Avatar" className="w-24 h-24 rounded-full" />
        ) : (
          <p>No avatar available.</p>
        )}
      </div>
    </div>
  );
}
