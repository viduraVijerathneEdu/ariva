"use client";

import { useState } from "react";
import Image from "next/image";
import raw from "../data/content.json";
import type { SiteContent, Vibe } from "../data/types";

const content = raw as unknown as SiteContent;

const DAY_OPTIONS = [5, 7, 10, 12, 14];

export default function Hero() {
  const hero = content.hero;
  const video = hero.video;
  const [vibe, setVibe] = useState<Vibe>("cultural");
  const [days, setDays] = useState(7);

  const destCount = content.destinations.length;
  const activityCount = content.destinations.reduce(
    (sum, d) => sum + d.activities.length,
    0
  );

  const planTrip = () => {
    window.dispatchEvent(new CustomEvent("ariva:vibe", { detail: vibe }));
    document.querySelector("#plan")?.scrollIntoView({ behavior: "smooth" });
  };

  const ticker = content.destinations.map((d) => d.name);

  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink">
      {video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero.image}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          priority
          className="object-cover animate-kenburns"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-10">
        <p className="animate-fade-up flex items-center gap-3 text-goldlight tracking-[0.35em] uppercase text-xs mb-6">
          <span className="inline-block h-px w-10 bg-gold" />
          {hero.eyebrow}
        </p>
        <h1
          className="animate-fade-up font-display text-cream text-5xl md:text-7xl leading-[1.02] max-w-3xl"
          style={{ animationDelay: "0.1s" }}
        >
          Sri Lanka,
          <br />
          <em className="text-goldlight font-medium">made personal.</em>
        </h1>
        <p
          className="animate-fade-up text-cream/85 max-w-2xl mt-6 text-lg leading-relaxed"
          style={{ animationDelay: "0.2s" }}
        >
          {hero.subtitle}
        </p>

        {/* Quick planner */}
        <div
          className="animate-fade-up mt-9 max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md shadow-2xl"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="flex-1 rounded-xl bg-ink/40 px-4 py-3">
              <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">
                Journey style
              </span>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value as Vibe)}
                className="mt-1 w-full bg-transparent text-cream font-medium outline-none [&>option]:text-ink"
              >
                {content.vibes
                  .filter((v) => !v.comingSoon)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="sm:w-36 rounded-xl bg-ink/40 px-4 py-3">
              <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">
                Days
              </span>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-cream font-medium outline-none [&>option]:text-ink"
              >
                {DAY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} days
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={planTrip}
              className="rounded-xl bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-goldlight sm:self-stretch flex items-center justify-center gap-2"
            >
              Plan my trip
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats + ratings */}
        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-10 gap-y-4"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex gap-8">
            <div>
              <p className="font-display text-2xl text-cream">{destCount}</p>
              <p className="text-cream/55 text-[0.7rem] uppercase tracking-wider">Destinations</p>
            </div>
            <div>
              <p className="font-display text-2xl text-cream">{activityCount}</p>
              <p className="text-cream/55 text-[0.7rem] uppercase tracking-wider">Experiences</p>
            </div>
            <div>
              <p className="font-display text-2xl text-cream">4.9<span className="text-goldlight text-lg"> ★</span></p>
              <p className="text-cream/55 text-[0.7rem] uppercase tracking-wider">Guest rating</p>
            </div>
          </div>
          <a
            href="#destinations"
            className="link-gold text-sm font-medium text-cream/85 hover:text-cream transition-colors"
          >
            Explore all destinations →
          </a>
        </div>
      </div>

      {/* Destination ticker */}
      <div className="relative z-10 border-t border-white/10 bg-ink/60 backdrop-blur-sm overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-8 py-3.5 px-4">
          {[...ticker, ...ticker].map((name, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-display text-cream/70 text-lg italic">{name}</span>
              <span className="text-gold/60 text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
