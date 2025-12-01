"use client";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">RallyTime</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
               Say yes to more plans. Meet people who love to move, play, and get outside.

      </p>

      <button
        onClick={() => window.location.href = "/onboarding"}
        className="bg-black text-white rounded-lg py-3 px-6 font-semibold"
      >
        Get Early Access
      </button>

      <p className="text-sm text-gray-400 mt-6">
        Launching first in Atlanta — limited early access.
      </p>
    </main>
  );
}
