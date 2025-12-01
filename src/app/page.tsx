"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 backdrop-blur rounded-full mb-8 border border-black/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-700">
                Now launching in Atlanta
              </span>
            </div>

            {/* Main heading */}
             <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Say yes to
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
                more plans
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Meet people who love to move, play, and get outside. Tennis, pickleball, volleyball, running, and more.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => (window.location.href = "/onboarding")}
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 cursor-pointer"
              >
                Get Early Access
              </button>

              <Link
                href="/meetups"
                className="w-full sm:w-auto border-2 border-black px-8 py-4 rounded-xl font-bold text-lg bg-white hover:bg-gray-50 transition-all block cursor-pointer"
              >
                <span className="block text-center">Browse Meetups</span>
              </Link>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-black font-medium transition-colors group cursor-pointer"
            >
              <span>Already a member? Continue with Google</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Find your activity
            </h2>
            <p className="text-gray-600 text-lg">
              Join meetups for the sports and activities you love
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🎾", name: "Tennis" },
              { emoji: "🏓", name: "Pickleball" },
              { emoji: "🏐", name: "Volleyball" },
              { emoji: "🏃", name: "Running" },
              { emoji: "🧗", name: "Climbing" },
              { emoji: "🥾", name: "Hiking" },
              { emoji: "🏀", name: "Basketball" },
              { emoji: "⚽", name: "Soccer" },
            ].map((activity) => (
              <div
                key={activity.name}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all border border-gray-200 hover:border-gray-300 hover:shadow-md group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {activity.emoji}
                </div>
                <div className="font-semibold text-gray-800">{activity.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              How it works
            </h2>
            <p className="text-gray-600 text-lg">
              Three simple steps to your next adventure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Find a meetup</h3>
              <p className="text-gray-600">
                Browse local meetups for activities you enjoy
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Join & chat</h3>
              <p className="text-gray-600">
                RSVP and connect with other participants
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Show up & play</h3>
              <p className="text-gray-600">
                Meet new people and have fun together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join Atlanta's most active community
          </p>
          <button
            onClick={() => (window.location.href = "/onboarding")}
            className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 cursor-pointer"
          >
            Get Early Access
          </button>
        </div>
      </section>

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