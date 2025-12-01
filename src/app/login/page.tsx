"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";


export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const ref = doc(db, "users", user.email!);
      const snap = await getDoc(ref);

      // If first time logging in, create user record
      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName ?? "",
          email: user.email ?? "",
          photo: user.photoURL ?? "",
          bio: "",
          socials: {},
          activities: [],
          createdAt: new Date(),
        });
      }

      const updatedSnap = await getDoc(ref);
      const data = updatedSnap.data();

      // If no bio set yet → onboarding
      if (!data?.bio || data.bio.trim() === "") {
        window.location.href = "/onboarding/profile";
      } else {
        window.location.href = "/meetups";
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Login failed — please try again.");
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
     

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
        <div className="max-w-md w-full">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 backdrop-blur rounded-full border border-black/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-700">
                Welcome back
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight">
              Continue to
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
                RallyTime
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Sign in to access your meetups and connect with your community
            </p>
          </div>

          {/* Why Google Sign-In boxes */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-xs font-semibold text-gray-800">Fast</div>
              <div className="text-xs text-gray-500 mt-1">One-click login</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-xs font-semibold text-gray-800">Secure</div>
              <div className="text-xs text-gray-500 mt-1">Protected by Google</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">✨</div>
              <div className="text-xs font-semibold text-gray-800">Simple</div>
              <div className="text-xs text-gray-500 mt-1">No password needed</div>
            </div>
          </div>

          {/* Login button */}
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-500 mt-8">
            By continuing, you agree to our{" "}
            <a href="#" className="text-gray-700 hover:text-black font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-700 hover:text-black font-medium">
              Privacy Policy
            </a>
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                New to RallyTime?
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <button
            onClick={() => window.location.href = "/"}
            className="w-full border-2 border-black px-8 py-4 rounded-xl font-bold text-lg bg-white hover:bg-gray-50 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Get Early Access
          </button>
        </div>
      </div>

      {/* Decorative circles - matching homepage */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}