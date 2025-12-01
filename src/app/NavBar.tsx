"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🎾</span>
          <span className="font-bold text-lg">RallyTime</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/meetups"
            className={`text-sm font-medium ${
              isActive("/meetups") ? "text-black" : "text-gray-500"
            }`}
          >
            Meetups
          </Link>

          <Link
            href="/meetups/new"
            className={`text-sm font-medium ${
              isActive("/meetups/new") ? "text-black" : "text-gray-500"
            }`}
          >
            Create
          </Link>

          {!user && (
            <Link
              href="/login"
              className="text-sm font-semibold px-3 py-1 rounded-full border border-black"
            >
              Login
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {user.displayName ?? user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
