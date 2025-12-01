"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const activities = [
  "Tennis",
  "Pickleball",
  "Volleyball",
  "Running",
  "Climbing",
  "Hiking",
  "Basketball",
  "Soccer",
  "Gym workouts",
  "Walking",
  "Yoga",
];

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

export default function NewMeetup() {
  const [title, setTitle] = useState("");
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(getToday);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [max, setMax] = useState(2);
  const [created, setCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, "meetups"), {
      title,
      activity,
      date,         // "2025-12-01"
      time,         // "18:00"
      location,
      max,
      participants: [],
      createdAt: serverTimestamp(),
    });

    setCreated(true);
  };

  if (created) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Meetup Created 🎉</h1>
        <button
          onClick={() => window.location.href = "/meetups"}
          className="underline text-blue-600 font-semibold"
        >
          Back to Meetups →
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Create a Meetup</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-left">Title</label>
          <input
            type="text"
            placeholder="Tennis at Piedmont Park"
            className="border px-4 py-3 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Activity */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-left">Activity</label>
          <select
            className="border px-4 py-3 rounded-lg"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          >
            <option value="">Select activity</option>
            {activities.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-left">Date</label>
          <input
            type="date"
            className="border px-4 py-3 rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 text-left">
            Pick the day you want to meet up.
          </p>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-left">Time</label>
          <input
            type="time"
            className="border px-4 py-3 rounded-lg"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 text-left">
            Use local time (ex: 18:30 for 6:30pm).
          </p>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-left">Location</label>
          <input
            type="text"
            placeholder="Piedmont Park, Stone Summit, etc."
            className="border px-4 py-3 rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Max players / people */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-left">Max people</label>
          <input
            type="number"
            min={1}
            max={50}
            className="border px-4 py-3 rounded-lg"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            required
          />
          <p className="text-xs text-gray-500 text-left">
            How many people can join this meetup?
          </p>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-3 rounded-lg font-semibold"
        >
          Create Meetup
        </button>
      </form>
    </main>
  );
}
