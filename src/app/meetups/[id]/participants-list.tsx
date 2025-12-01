"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Props {
  emails: string[];
}

export default function ParticipantsList({ emails }: Props) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const results = [];
      for (const email of emails) {
        // user UID = document with email stored, so we search by email
        const ref = doc(db, "users", email);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          results.push(snap.data());
        } else {
          // fallback if user not found in Firestore
          results.push({ email });
        }
      }
      setUsers(results);
    }
    fetchUsers();
  }, [emails]);

  return (
    <div className="flex flex-wrap gap-3">
      {users.map((u, i) => (
        <div key={i} className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
          {u.photo ? (
            <img src={u.photo} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
              {u.email?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}
          <span className="font-medium">
            {u.name ?? u.email}
          </span>
        </div>
      ))}
    </div>
  );
}
