"use client";

import React, { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UserProfilePage({ params }: { params: Promise<{ email: string }> }) {
  const { email: rawEmail } = React.use(params);
  const email = decodeURIComponent(rawEmail);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const ref = doc(db, "users", email);
      const snap = await getDoc(ref);
      if (snap.exists()) setUser(snap.data());
    }
    load();
  }, [email]);

  if (!user) return <main className="min-h-screen flex items-center justify-center">Loading…</main>;

  const isMe = auth.currentUser?.email === email;

  return (
    <main className="min-h-screen max-w-xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-6">
        {user.photo && (
          <img src={user.photo} className="w-20 h-20 rounded-full object-cover" />
        )}
        <h1 className="text-4xl font-bold">{user.name}</h1>
      </div>

      {user.bio && <p className="text-gray-700 mb-6">{user.bio}</p>}

      {user.activities?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Activities</h2>
          <div className="flex flex-wrap gap-2">
            {user.activities.map((a: string) => (
              <span key={a} className="px-3 py-1 bg-black text-white rounded-full text-sm">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {isMe && (
        <a
          href="/profile/edit"
          className="block bg-black text-white py-3 rounded-lg font-semibold text-center mt-10"
        >
          Edit Profile
        </a>
      )}
    </main>
  );
}