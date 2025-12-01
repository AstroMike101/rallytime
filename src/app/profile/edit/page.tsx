"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const activitiesList = [
  "Tennis", "Pickleball", "Volleyball", "Running",
  "Climbing", "Hiking", "Basketball", "Soccer",
  "Gym workouts", "Walking", "Yoga", "Other",
];

export default function EditProfilePage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [activities, setActivities] = useState<string[]>([]);

  // Fetch profile on mount
  useEffect(() => {
    if (!user) return router.push("/login");

    (async () => {
      const ref = doc(db, "users", user.email!);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setBio(data.bio ?? "");
        setInstagram(data.socials?.instagram ?? "");
        setActivities(data.activities ?? []);
      }
    })();
  }, [user, router]);

  const toggleActivity = (act: string) => {
    setActivities((prev) =>
      prev.includes(act) ? prev.filter((x) => x !== act) : [...prev, act]
    );
  };

  const save = async () => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.email!), {
      bio,
      socials: { instagram },
      activities,
    });

    router.push(`/users/${encodeURIComponent(user.email!)}`);
  };

  return (
    <main className="min-h-screen max-w-xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">Edit Profile</h1>

      <label className="font-semibold mb-2 block">Bio</label>
      <textarea
        className="border rounded-lg w-full p-3 h-28 mb-6"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell others about yourself"
      />

      <label className="font-semibold mb-2 block">Activities</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {activitiesList.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggleActivity(a)}
            className={`px-3 py-1 rounded-full border ${
              activities.includes(a)
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <label className="font-semibold mb-2 block">Instagram</label>
      <input
        type="text"
        className="border rounded-lg w-full p-3 mb-10"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        placeholder="@username"
      />

      <button
        onClick={save}
        className="bg-black text-white w-full py-3 rounded-lg font-semibold"
      >
        Save Changes
      </button>
    </main>
  );
}
