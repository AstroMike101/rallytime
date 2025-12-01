"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

      {user.socials?.instagram && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Social</h2>
          <a
            href={`https://instagram.com/${user.socials.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {user.socials.instagram}
          </a>
        </div>
      )}

      {isMe && (
        <Link
          href="/profile/edit"
          className="block bg-black text-white py-3 rounded-lg font-semibold text-center mt-10"
        >
          Edit Profile
        </Link>
      )}
    </main>
  );
}