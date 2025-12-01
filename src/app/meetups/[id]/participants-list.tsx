"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ParticipantsList({ emails }: { emails: string[] }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const out: any[] = [];

      for (const email of emails) {
        const snap = await getDoc(doc(db, "users", email));
        if (snap.exists()) {
          const data = snap.data();
          out.push({
            email,
            name: data.name ?? email,
            photo: data.photo ?? null,
          });
        } else {
          out.push({ email, name: email, photo: null });
        }
      }

      setUsers(out);
    }

    load();
  }, [emails]);

  return (
    <div className="flex flex-wrap gap-3">
      {users.map((u, i) => (
        <Link
          key={i}
          href={`/users/${encodeURIComponent(u.email)}`}
          className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white hover:bg-gray-100 transition"
        >
          {u.photo ? (
            <img src={u.photo} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
              {u.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium truncate max-w-[120px]">
            {u.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
