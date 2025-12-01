"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Chat from "./chat";
import ParticipantsList from "./participants-list";

export default function MeetupDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading meetup...</p>
        </div>
      </main>
    );
  }

  const spotsTaken = meetup.participants.length;
  const spotsTotal = meetup.max;
  const isFull = spotsTaken >= spotsTotal;
  const alreadyJoined = userEmail && meetup.participants.includes(userEmail);
  const spotsPercentage = (spotsTaken / spotsTotal) * 100;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back button */}
        <Link
          href="/meetups"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Meetups
        </Link>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Header section */}
          <div className="p-6 sm:p-8 border-b">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{meetup.title}</h1>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                {meetup.activity}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {meetup.location}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {meetup.date} at {meetup.time}
            </div>
          </div>

          {/* Description */}
          {meetup.description && (
            <div className="p-6 sm:p-8 border-b bg-gray-50">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {meetup.description}
              </p>
            </div>
          )}

          {/* Spots indicator */}
          <div className="p-6 sm:p-8 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
              <span className="text-2xl font-bold text-gray-900">
                {spotsTaken}/{spotsTotal}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFull ? "bg-red-500" : spotsPercentage > 75 ? "bg-yellow-500" : "bg-green-500"
                }`}
                style={{ width: `${spotsPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {isFull ? "This meetup is full" : `${spotsTotal - spotsTaken} spot${spotsTotal - spotsTaken !== 1 ? 's' : ''} remaining`}
            </p>
          </div>

          {/* Join/Status section */}
          <div className="p-6 sm:p-8 border-b">
            {!userEmail && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-900 font-medium">
                  <Link href="/login" className="underline font-semibold hover:text-blue-700">
                    Log in
                  </Link>{" "}
                  to join this meetup
                </p>
              </div>
            )}

            {userEmail && !alreadyJoined && !isFull && (
              <button
                onClick={joinMeetup}
                disabled={joining}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {joining ? "Joining..." : "Join Meetup"}
              </button>
            )}

            {alreadyJoined && (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 text-center">
                <p className="text-green-800 font-bold text-lg flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You're in! 🎉
                </p>
              </div>
            )}

            {isFull && !alreadyJoined && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-800 font-semibold">This meetup is full</p>
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Participants ({meetup.participants.length})
            </h2>
            {meetup.participants.length === 0 && (
              <p className="text-gray-500 italic">Nobody has joined yet — be the first!</p>
            )}
            {meetup.participants.length > 0 && (
              <ParticipantsList emails={meetup.participants} />
            )}
          </div>
        </div>

        {/* Chat section */}
        {alreadyJoined && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <Chat meetupId={id!} />
          </div>
        )}
      </div>
    </main>
  );
}