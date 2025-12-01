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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "meetups"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setMeetups(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Meetup, "id">),
        }))
      );
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading meetups...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Meetups
            </h1>
            <p className="text-gray-600 text-lg">
              Find your next adventure
            </p>
          </div>
          
          <Link
            href="/meetups/new"
            className="inline-flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Meetup
          </Link>
        </div>

        {/* Empty state */}
        {meetups.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No meetups yet</h2>
            <p className="text-gray-600 mb-6">Be the first to create one!</p>
            <Link
              href="/meetups/new"
              className="inline-flex items-center gap-2 bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Meetup
            </Link>
          </div>
        )}

        {/* Meetups grid */}
        {meetups.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetups.map((m) => {
              const spotsTaken = m.participants.length;
              const spotsTotal = m.max;
              const isFull = spotsTaken >= spotsTotal;
              const spotsPercentage = (spotsTaken / spotsTotal) * 100;

              return (
                <Link
                  href={`/meetups/${m.id}`}
                  key={m.id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all hover:shadow-xl hover:border-gray-300 hover:-translate-y-1">
                    {/* Card header */}
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold mb-3 group-hover:text-black transition-colors line-clamp-2">
                        {m.title}
                      </h2>
                      
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full text-xs font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        {m.activity}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate font-medium">{m.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{m.date}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">{m.time}</span>
                      </div>

                      {/* Spots indicator */}
                      <div className="pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Availability
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {spotsTaken}/{spotsTotal}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isFull ? "bg-red-500" : 
                              spotsPercentage > 75 ? "bg-yellow-500" : 
                              "bg-green-500"
                            }`}
                            style={{ width: `${spotsPercentage}%` }}
                          ></div>
                        </div>

                        {isFull && (
                          <p className="text-xs text-red-600 font-semibold mt-2">
                            🔴 Full
                          </p>
                        )}
                        {!isFull && (
                          <p className="text-xs text-green-600 font-semibold mt-2">
                            ✅ {spotsTotal - spotsTaken} spot{spotsTotal - spotsTaken !== 1 ? 's' : ''} left
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}