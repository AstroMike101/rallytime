"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Chat from "./chat";

const TEMP_USER_EMAIL = "test@rallytime.com";

export default function MeetupDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // get meetup ID from URL

  const [meetup, setMeetup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function fetchMeetup() {
      if (!id) return;
      const ref = doc(db, "meetups", id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setMeetup({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    }
    fetchMeetup();
  }, [id]);

  const joinMeetup = async () => {
    if (!meetup) return;
    setJoining(true);
    const ref = doc(db, "meetups", id!);
    await updateDoc(ref, {
      participants: arrayUnion(TEMP_USER_EMAIL),
    });
    setMeetup({
      ...meetup,
      participants: [...meetup.participants, TEMP_USER_EMAIL],
    });
    setJoining(false);
  };

  if (loading || !meetup) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  const spotsTaken = meetup.participants.length;
  const spotsTotal = meetup.max;
  const isFull = spotsTaken >= spotsTotal;
  const alreadyJoined = meetup.participants.includes(TEMP_USER_EMAIL);

  return (
    <main className="min-h-screen px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-3">{meetup.title}</h1>
      <p className="text-gray-600 mb-4">
        {meetup.activity} • {meetup.location}
      </p>
      <p className="text-gray-800 font-medium mb-4">
        {meetup.date} @ {meetup.time}
      </p>
      <p className="text-gray-900 font-semibold mb-6">
        Spots: {spotsTaken}/{spotsTotal}
      </p>

      {!alreadyJoined && !isFull && (
        <button
          onClick={joinMeetup}
          disabled={joining}
          className="bg-black text-white py-3 px-6 rounded-lg font-semibold w-full"
        >
          {joining ? "Joining..." : "Join Meetup"}
        </button>
      )}

      {alreadyJoined && (
        <p className="text-green-600 font-semibold text-center mt-4">
          You’re in! 🎉
        </p>
      )}

      {isFull && !alreadyJoined && (
        <p className="text-red-600 font-semibold text-center mt-4">
          This meetup is full.
        </p>
      )}

      {alreadyJoined && <Chat meetupId={id!} />}

      <a
        href="/meetups"
        className="underline text-blue-600 font-semibold mt-6 block text-center"
      >
        Back to Meetups →
      </a>
    </main>
  );
}
