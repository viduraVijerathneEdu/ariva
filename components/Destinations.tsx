"use client";

import { useState } from "react";
import Image from "next/image";
import raw from "../data/content.json";
import type { SiteContent, Vibe } from "../data/types";

const content = raw as unknown as SiteContent;

const FILTERS: { id: Vibe | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cultural", label: "Cultural" },
  { id: "wildlife", label: "Wildlife" },
  { id: "adventure", label: "Adventure" },
  { id: "spiritual", label: "Spiritual" },
];

export default function Destinations() {
  const [filter, setFilter] = useState<Vibe | "all">("all");

  const visible = content.destinations.filter(
    (d) =>
      filter === "all" ||
      d.activities.some((a) => a.vibes.includes(filter))
  );

  return (
    <section id="destinations" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-gold tracking-[0.35em] uppercase text-xs mb-4">
            Explore Lanka
          </p>
          <h2 className="font-display text-4xl text-ink">
            Thirty destinations, airport outward
          </h2>
          <p className="text-ink/60 mt-4">
            Listed in travel order from the international airport — near first,
            far last.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition border ${
                filter === f.id
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent text-ink/70 border-ink/20 hover:border-ink/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((d) => (
            <a
              key={d.slug}
              href={`/destinations/${d.slug}`}
              className="group relative block overflow-hidden rounded-2xl aspect-[3/4]"
            >
              <Image
                src={d.image}
                alt={d.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-cream">{d.name}</h3>
                <p className="text-cream/75 text-sm mt-1 line-clamp-2">
                  {d.tagline}
                </p>
                <p className="text-goldlight text-xs mt-3 uppercase tracking-wider">
                  {d.activities.length} experiences · View →
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
