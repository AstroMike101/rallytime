"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

const activitiesList = [
  "Tennis", "Pickleball", "Volleyball", "Running",
  "Climbing", "Hiking", "Basketball", "Soccer",
  "Gym workouts", "Walking", "Yoga", "Other",
];

export default function ProfileOnboarding() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [activities, setActivities] = useState<string[]>([]);

  // Wait for Firebase to finish auth before redirecting
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email!);

      // Load existing profile if it exists
      const ref = doc(db, "users", user.email!);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setBio(data.bio ?? "");
        setInstagram(data.socials?.instagram ?? "");
        setActivities(data.activities ?? []);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const toggleActivity = (act: string) => {
    setActivities(prev =>
      prev.includes(act) ? prev.filter(x => x !== act) : [...prev, act]
    );
  };

  const save = async () => {
    if (!userEmail) return;

    const ref = doc(db, "users", userEmail);
    await updateDoc(ref, {
      bio,
      socials: { instagram },
      activities,
      onboardingComplete: true,
    });

    router.push("/meetups");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">Welcome to RallyTime 👋</h1>
      <p className="text-gray-600 mb-8">
        Help others get to know you — this makes meetups more fun and safe.
      </p>

      {/* Bio */}
      <label className="font-semibold mb-1 block">Short bio</label>
      <textarea
        className="border rounded-lg w-full p-3 h-28 mb-6"
        placeholder="Example: I love tennis & climbing — usually free weeknights. Intermediate level."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      {/* Activities */}
      <label className="font-semibold mb-2 block">Your activities</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {activitiesList.map((act) => (
          <button
            key={act}
            onClick={() => toggleActivity(act)}
            type="button"
            className={`px-3 py-1 rounded-full border ${
              activities.includes(act)
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Socials */}
      <label className="font-semibold mb-1 block">Instagram (optional)</label>
      <input
        type="text"
        className="border rounded-lg w-full p-3 mb-10"
        placeholder="@username"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
      />

      <button
        onClick={save}
        className="bg-black text-white px-6 py-3 rounded-lg font-semibold w-full"
      >
        Continue
      </button>
    </main>
  );
}
