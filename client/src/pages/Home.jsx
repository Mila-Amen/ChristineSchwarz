import React from "react";

export default function Home() {
  return (
    <section className="relative min-h-screen">
    <img src="Hero.jpg" alt="" className="w-full h-full object-cover absolute inset-0 z-0" />
  
    <div className="relative z-10 flex items-center justify-end h-full px-6 md:px-24 min-h-screen">
      <div className="bg-black bg-opacity-50 p-6 md:p-10 rounded-lg max-w-xl text-left">
        <h1 className="text-4xl md:text-6xl font-bold text-teal-300 mb-4  drop-shadow-2xl">
          Empowering Your Wellness Journey
        </h1>
        <p className="text-lg md:text-xl text-white">
          Discover personalized health management, expert stress consultation,
          and curated wellness resources to support your mind and body.
        </p>
      </div>
    </div>
  </section>
  
  );
}
