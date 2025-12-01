"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const activitiesList = [
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
  "Other",
];

const ageRanges = [
  "18–22",
  "22–26",
  "26–30",
  "30–35",
  "35–40",
  "40+"
];

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

export default function Onboarding() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [skill, setSkill] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, "profiles"), {
      email,
      name,
      ageRange,
      activities: selectedActivities,
      skill,
      createdAt: serverTimestamp(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">You're all set 🎉</h1>
        <p className="text-gray-600 max-w-md">
          We’ll message you when there are activities and meetups that match your interests.
          RallyTime is launching first in Atlanta.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to RallyTime 👋</h1>
      <p className="text-gray-600 mb-10 text-center">
        Tell us what you're into so we can invite you to the right events.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        {/* Email */}
        <input
          type="email"
          placeholder="Your email"
          className="border px-4 py-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Name */}
        <input
          type="text"
          placeholder="Your first name"
          className="border px-4 py-3 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Age */}
        <select
          className="border px-4 py-3 rounded-lg"
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
          required
        >
          <option value="">Select your age range</option>
          {ageRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>

        {/* Activities */}
        <div className="flex flex-wrap gap-3">
          {activitiesList.map((activity) => (
            <button
              key={activity}
              type="button"
              onClick={() => toggleActivity(activity)}
              className={`px-4 py-2 rounded-full border ${
                selectedActivities.includes(activity)
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {activity}
            </button>
          ))}
        </div>

        {/* Skill */}
        <select
          className="border px-4 py-3 rounded-lg"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          required
        >
          <option value="">Skill level</option>
          {skillLevels.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white py-3 rounded-lg font-semibold"
        >
          Finish
        </button>
      </form>
    </main>
  );
}
