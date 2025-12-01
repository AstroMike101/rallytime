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
    <nav className="w-full border-b-2 border-black bg-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <span className="font-black text-lg sm:text-2xl tracking-tight">RallyTime</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-8">
          <Link
            href="/meetups"
            className={`text-xs sm:text-base font-semibold transition-all ${
              isActive("/meetups") 
                ? "text-black border-b-2 border-black pb-1" 
                : "text-gray-500 hover:text-black"
            }`}
          >
            Meetups
          </Link>

          <Link
            href="/meetups/new"
            className={`text-xs sm:text-base font-semibold transition-all ${
              isActive("/meetups/new") 
                ? "text-black border-b-2 border-black pb-1" 
                : "text-gray-500 hover:text-black"
            }`}
          >
            Create
          </Link>

          {!user && (
            <Link
              href="/login"
              className="text-xs sm:text-base font-bold px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-black text-white hover:bg-gray-900 hover:scale-105 transition-all shadow-md"
            >
              Login
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-3 sm:gap-6">
              <Link
                href={`/users/${encodeURIComponent(user.email)}`}
                className={`text-xs sm:text-base font-semibold transition-all ${
                  isActive(`/users/${encodeURIComponent(user.email)}`)
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs sm:text-base font-medium text-gray-500 hover:text-red-600 transition-colors"
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