"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const ref = doc(db, "users", user.email!);
      const snap = await getDoc(ref);

      // If first time logging in, create user record
      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName ?? "",
          email: user.email ?? "",
          photo: user.photoURL ?? "",
          bio: "",
          socials: {},
          activities: [],
          createdAt: new Date(),
        });
      }

      const updatedSnap = await getDoc(ref);
      const data = updatedSnap.data();

      // If no bio set yet → onboarding
      if (!data?.bio || data.bio.trim() === "") {
        window.location.href = "/onboarding/profile";
      } else {
        window.location.href = "/meetups";
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Login failed — please try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <h1 className="text-5xl font-bold mb-3">🎾 RallyTime</h1>
      <p className="text-lg text-gray-600 max-w-md mb-10">
        Meet people in your city through sports, fitness, and fun.
      </p>

      <button
        onClick={login}
        disabled={loading}
        className="bg-black hover:bg-gray-900 text-white py-3 px-6 rounded-lg text-lg font-semibold flex gap-2 items-center shadow-md transition disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </button>

  
    </main>
  );
}
