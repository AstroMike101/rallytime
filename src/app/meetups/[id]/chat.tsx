"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function Chat({ meetupId }: { meetupId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const ref = collection(db, "meetups", meetupId, "messages");
    const q = query(ref, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      // Auto-scroll to bottom when new messages arrive
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
  }, [meetupId]);

  const send = async () => {
    if (!text.trim() || sending) return;

    const user = auth.currentUser;
    setSending(true);

    try {
      await addDoc(collection(db, "meetups", meetupId, "messages"), {
        userEmail: user?.email || null,
        userName: user?.displayName || user?.email || "Unknown",
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Group Chat</h2>

      {/* Messages container */}
      <div className="border-2 border-gray-200 rounded-xl h-96 overflow-y-auto bg-gray-50 mb-4">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center italic py-8">
              No messages yet. Start the conversation!
            </p>
          )}

          {messages.map((m) => {
            const isMe = m.userEmail === currentUserEmail;
            
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <Link
                  href={m.userEmail ? `/users/${encodeURIComponent(m.userEmail)}` : "#"}
                  className="flex-shrink-0"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white cursor-pointer hover:opacity-80 transition-opacity ${
                      isMe ? "bg-black" : "bg-gray-400"
                    }`}
                  >
                    {m.userName?.charAt(0)?.toUpperCase()}
                  </div>
                </Link>

                {/* Message bubble */}
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                  <Link
                    href={m.userEmail ? `/users/${encodeURIComponent(m.userEmail)}` : "#"}
                    className={`text-xs font-semibold mb-1 hover:underline ${
                      isMe ? "text-gray-700" : "text-gray-600"
                    }`}
                  >
                    {isMe ? "You" : m.userName}
                  </Link>

                  <div
                    className={`px-4 py-2.5 rounded-2xl ${
                      isMe
                        ? "bg-black text-white rounded-tr-sm"
                        : "bg-white border-2 border-gray-200 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{m.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={sending}
          className="border-2 border-gray-200 rounded-xl px-4 py-3 flex-1 focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {sending ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">Press Enter to send</p>
    </div>
  );
}