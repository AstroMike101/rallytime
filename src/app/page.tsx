"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-white to-gray-100">
      <h1 className="text-5xl font-extrabold mb-4">🎾 RallyTime</h1>

      <p className="text-lg text-gray-700 max-w-md mb-10">
        Say yes to more plans. Meet people who love to move, play, and get outside — 
        tennis, pickleball, volleyball, running, and more.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => (window.location.href = "/onboarding")}
          className="bg-black text-white py-3 rounded-lg font-semibold text-lg"
        >
          Get Early Access
        </button>

        <Link
          href="/meetups"
          className="border border-black py-3 rounded-lg font-semibold text-lg bg-white"
        >
          Browse Meetups
        </Link>

        <Link
          href="/login"
          className="text-blue-600 font-medium underline text-sm mt-2"
        >
          Already a member? Continue with Google →
        </Link>
      </div>

      <p className="text-gray-500 text-xs mt-10">
        Launching first in Atlanta — limited early access.
      </p>
    </main>
  );
}
