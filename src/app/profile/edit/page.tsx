"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const activitiesList = [
  "Tennis","Pickleball","Volleyball","Running","Climbing","Hiking",
  "Basketball","Soccer","Gym workouts","Walking","Yoga","Other",
];

export default function EditProfile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [activities, setActivities] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return router.push("/login");

    (async () => {
      const ref = doc(db, "users", user.email!);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setBio(d.bio ?? "");
        setInstagram(d.socials?.instagram ?? "");
        setActivities(d.activities ?? []);
      }
      setLoading(false);
    })();
  }, [user, router]);

  const toggle = (a: string) => {
    setActivities((prev) => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const save = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.email!), {
      bio,
      socials: { instagram },
      activities,
    });
    router.push(`/users/${user.email}`);
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center">Loading…</main>;

  return (
    <main className="min-h-screen max-w-xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

      <textarea
        className="border rounded-lg w-full p-3 h-28 mb-6"
        placeholder="Short bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <label className="font-semibold mb-2 block">Your activities</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {activitiesList.map((a) => (
          <button
            key={a}
            onClick={() => toggle(a)}
            className={`px-3 py-1 rounded-full border ${
              activities.includes(a) ? "bg-black text-white" : "bg-white text-gray-700"
            }`}
            type="button"
          >
            {a}
          </button>
        ))}
      </div>

      <input
        className="border rounded-lg w-full p-3 mb-10"
        placeholder="@instagram (optional)"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
      />

      <button onClick={save} className="bg-black text-white w-full py-3 rounded-lg font-semibold">
        Save
      </button>
    </main>
  );
}
