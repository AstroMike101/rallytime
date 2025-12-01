"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await addDoc(collection(db, "waitlist"), {
      email,
      createdAt: serverTimestamp(),
    });

    setSuccess(true);
    setEmail("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">RallyTime</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Say yes to more plans. Meet people who love to move, play, and get outside.
      </p>

      {!success ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
          <input
            type="email"
            placeholder="Enter your email"
            className="border rounded-lg px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white rounded-lg py-3 font-semibold"
          >
            Join the Waitlist
          </button>
        </form>
      ) : (
        <p className="text-green-600 font-semibold text-lg">
          You're in! We'll email you soon 👋
        </p>
      )}

      <p className="text-sm text-gray-400 mt-6">
        Launching first in Atlanta — limited early access.
      </p>
    </main>
  );
}
