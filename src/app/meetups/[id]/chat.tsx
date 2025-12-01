"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const TEMP_USER_EMAIL = "test@rallytime.com";

export default function Chat({ meetupId }: { meetupId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const ref = collection(db, "meetups", meetupId, "messages");
    const q = query(ref, orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, [meetupId]);

  const send = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "meetups", meetupId, "messages"), {
      user: TEMP_USER_EMAIL,
      text,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-3">Chat</h2>

      <div className="border rounded-lg h-64 p-3 overflow-y-auto flex flex-col gap-2 bg-white">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-semibold">{m.user}: </span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button
          onClick={send}
          className="bg-black text-white px-4 py-2 rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
