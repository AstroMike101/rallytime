"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Chat from "./chat";
import { auth } from "@/lib/firebase";

function getUserInitial(email: string) {
  return email?.charAt(0)?.toUpperCase() ?? "?";
}

export default function MeetupDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // meetup id from URL

  const [meetup, setMeetup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const user = auth.currentUser;
  const userEmail = user?.email;

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
    if (!meetup || !userEmail) return;
    setJoining(true);
    const ref = doc(db, "meetups", id!);
    await updateDoc(ref, {
      participants: arrayUnion(userEmail),
    });
    setMeetup({
      ...meetup,
      participants: [...meetup.participants, userEmail],
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
  const alreadyJoined = userEmail && meetup.participants.includes(userEmail);

  return (
    <main className="min-h-screen px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-3">{meetup.title}</h1>
      <p className="text-gray-600 mb-1">
        {meetup.activity} • {meetup.location}
      </p>
      <p className="text-gray-800 font-medium mb-4">
        {meetup.date} @ {meetup.time}
      </p>

      <p className="text-gray-900 font-semibold mb-6">
        Spots: {spotsTaken}/{spotsTotal}
      </p>

      {/* Participants list */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Participants</h2>

        {meetup.participants.length === 0 && (
          <p className="text-gray-500">Nobody has joined yet — be the first!</p>
        )}

        <div className="flex flex-wrap gap-3">
          {meetup.participants.map((email: string) => (
            <div
              key={email}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-sm">
                {getUserInitial(email)}
              </div>
              <span className="text-sm font-medium truncate max-w-[120px]">
                {email}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!userEmail && (
        <p className="text-blue-600 font-semibold text-center mb-4">
          <a href="/login" className="underline">
            Log in
          </a>{" "}
          to join this meetup.
        </p>
      )}

      {userEmail && !alreadyJoined && !isFull && (
        <button
          onClick={joinMeetup}
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
