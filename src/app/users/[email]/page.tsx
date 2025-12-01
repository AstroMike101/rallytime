"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  name: string;
  email: string;
  photo?: string;
  bio?: string;
  activities?: string[];
  socials?: { instagram?: string };
}

export default function UserProfilePage({ params }: { params: { email: string } }) {
  const email = decodeURIComponent(params.email);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function load() {
      const ref = doc(db, "users", email);
      const snap = await getDoc(ref);
      if (snap.exists()) setUser(snap.data() as UserProfile);
    }
    load();
  }, [email]);

  if (!user) return <main className="min-h-screen flex items-center justify-center">Loading…</main>;

  const isMe = auth.currentUser?.email === email;

  return (
    <main className="min-h-screen max-w-xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-6">
        {user.photo && <img src={user.photo} className="w-20 h-20 rounded-full object-cover" />}
        <h1 className="text-4xl font-bold">{user.name}</h1>
      </div>

      {user.bio && <p className="text-gray-700 mb-6">{user.bio}</p>}

      {user.activities?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Activities</h2>
          <div className="flex flex-wrap gap-2">
            {user.activities.map((a) => (
              <span key={a} className="px-3 py-1 bg-black text-white text-sm rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.socials?.instagram && (
        <p className="text-blue-600 underline">
          <a href={`https://instagram.com/${user.socials.instagram.replace("@", "")}`} target="_blank">
            Instagram: {user.socials.instagram}
          </a>
        </p>
      )}

      {isMe && (
        <a
          href="/profile/edit"
          className="block bg-black text-white w-full text-center py-3 rounded-lg font-semibold mt-10"
        >
          Edit Profile
        </a>
      )}
    </main>
  );
}
