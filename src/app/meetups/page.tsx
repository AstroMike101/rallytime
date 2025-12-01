"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

interface Meetup {
  id: string;
  title: string;
  activity: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  max: number;
}

export default function Meetups() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);

  useEffect(() => {
    const q = query(collection(db, "meetups"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setMeetups(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Meetup, "id">),
        }))
      );
    });
  }, []);

  return (
    <main className="min-h-screen px-6 py-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">RallyTime Meetups</h1>

      <button
        onClick={() => (window.location.href = "/meetups/new")}
        className="bg-black text-white py-2 px-4 rounded-lg font-semibold mb-6"
      >
        Create Meetup
      </button>

      {meetups.length === 0 && (
        <p className="text-gray-600">
          No meetups yet — be the first to create one!
        </p>
      )}

      <div className="flex flex-col gap-4">
        {meetups.map((m, i) => (
          <Link href={`/meetups/${m.id}`} key={i}>
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
              <h2 className="text-2xl font-semibold mb-1">{m.title}</h2>
              <p className="text-gray-600">
                {m.activity} • {m.location} • {m.date} @ {m.time}
              </p>
              <p className="text-gray-900 font-medium mt-2">
                Spots: {m.participants.length}/{m.max}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
