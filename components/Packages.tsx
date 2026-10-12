"use client";

import Image from "next/image";
import { useState } from "react";
import raw from "../data/content.json";
import type { SiteContent, TierInfo, Vibe, VibePackage } from "../data/types";
import { useSite } from "../lib/site";
import { estimateFrom, type TierId } from "../lib/pricing";
import Reveal from "./Reveal";

const content = raw as unknown as SiteContent;

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TierCard({ tier }: { tier: TierInfo }) {
  const { formatUSD } = useSite();
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="font-display text-2xl text-goldlight">{tier.name}</h3>
      <p className="mt-1 text-sm text-cream/60">{tier.tagline}</p>

      <ul className="mt-5 space-y-3">
        {tier.highlights.map((h) => (
          <li key={h} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="text-sm leading-relaxed text-cream">{h}</span>
          </li>
        ))}
      </ul>

      <details className="mt-5 text-sm">
        <summary className="cursor-pointer text-gold hover:text-goldlight">
          Full details
        </summary>
        <dl className="mt-4 space-y-3 text-cream/75">
          <div>
            <dt className="font-medium text-cream">Lunch</dt>
            <dd className="mt-0.5">{tier.lunch}</dd>
          </div>
          <div>
            <dt className="font-medium text-cream">Transport</dt>
            <dd className="mt-0.5">{tier.transport}</dd>
          </div>
          <div>
            <dt className="font-medium text-cream">Guide</dt>
            <dd className="mt-0.5">{tier.guide}</dd>
          </div>
          <div>
            <dt className="font-medium text-cream">Accommodation</dt>
            <dd className="mt-0.5">{tier.accommodation}</dd>
          </div>
          <div>
            <dt className="font-medium text-cream">Ideal for</dt>
            <dd className="mt-0.5 italic">{tier.idealFor}</dd>
          </div>
          <p className="text-cream/60">{tier.hotelChoiceNote}</p>
        </dl>
      </details>

      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="text-lg text-cream">
          From{" "}
          <span className="font-display text-2xl text-goldlight">
            {formatUSD(estimateFrom(tier.id as TierId))}
          </span>
        </p>
        <p className="text-xs text-cream/50">per 7 days · 2 guests</p>
      </div>
    </div>
  );
}

function ComingSoonCard({ vibe }: { vibe: VibePackage }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <h3 className="font-display text-3xl text-goldlight">{vibe.name}</h3>
      <p className="mt-2 text-sm text-gold">{vibe.tagline}</p>
      <p className="mt-4 text-cream/70">{vibe.description}</p>
      {done ? (
        <p className="mt-6 rounded-xl bg-gold/10 px-4 py-3 text-goldlight">
          You&apos;re on the list — we&apos;ll email you first.
        </p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-xl border border-white/15 bg-ink px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-gold px-6 py-3 font-medium text-ink transition hover:brightness-110"
          >
            Notify me
          </button>
        </form>
      )}
    </div>
  );
}

function VibeDetail({ vibe }: { vibe: VibePackage }) {
  if (vibe.comingSoon) return <ComingSoonCard vibe={vibe} />;
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <Reveal>
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={vibe.image}
              alt={vibe.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {vibe.includesCoastal && (
            <span className="mt-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-medium tracking-wide text-goldlight">
              Includes coastal escapes
            </span>
          )}
          <p className="mt-4 leading-relaxed text-cream/75">{vibe.description}</p>
          <h4 className="mt-8 font-display text-xl text-goldlight">
            Sample moments
          </h4>
          <ul className="mt-4 space-y-2.5">
            {vibe.sampleItinerary.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-cream/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <div className="grid content-start gap-6 sm:grid-cols-1 xl:grid-cols-1">
        {content.tiers.map((tier, i) => (
          <Reveal key={tier.id} delay={i * 100}>
            <TierCard tier={tier} />
          </Reveal>
        ))}
        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("ariva:vibe", { detail: vibe.id as Vibe })
            );
            document
              .querySelector("#plan")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="rounded-xl bg-gold px-6 py-4 font-medium text-ink transition hover:brightness-110"
        >
          Customise {vibe.name}
        </button>
      </div>
    </div>
  );
}

export default function Packages() {
  const [activeVibe, setActiveVibe] = useState<Vibe>(content.vibes[0].id);
  const vibe = content.vibes.find((v) => v.id === activeVibe) ?? content.vibes[0];

  return (
    <section id="packages" className="bg-ink py-24 text-cream scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold">
            Journeys
          </p>
          <h2 className="mt-3 font-display text-4xl text-cream sm:text-5xl">
            Choose your Sri Lanka experience
          </h2>
          <p className="mt-4 max-w-2xl text-cream/65">
            Five ways to travel — each in Silver, Gold or Platinum.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-3">
          {content.vibes.map((v) => {
            const active = v.id === activeVibe;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVibe(v.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-gold text-ink"
                    : "border border-white/20 text-cream/70 hover:border-gold/60 hover:text-cream"
                }`}
              >
                {v.name}
              </button>
            );
          })}
        </div>

        <div className="mt-12">
          <VibeDetail key={vibe.id} vibe={vibe} />
        </div>
      </div>
    </section>
  );
}
