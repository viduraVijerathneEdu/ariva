"use client";

import { useMemo, useState } from "react";
import raw from "../data/content.json";
import type { SiteContent, Hotel } from "../data/types";

const content = raw as unknown as SiteContent;

const bookingUrl = (n: string) =>
  `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(n)}`;
const tripUrl = (n: string) =>
  `https://www.tripadvisor.com/Search?q=${encodeURIComponent(n)}`;

type HotelWithDest = Hotel & { destName: string };

export function HotelCard({
  hotel,
  destName,
}: {
  hotel: {
    name: string;
    stars: number;
    area: string;
    blurb: string;
    website?: string;
  };
  destName?: string;
}) {
  return (
    <article className="bg-cream rounded-2xl border border-ink/10 p-6 flex flex-col gap-3">
      <div>
        <h3 className="font-display text-xl text-ink">{hotel.name}</h3>
        <p className="text-gold text-sm mt-1" aria-label={`${hotel.stars} star`}>
          {"★".repeat(hotel.stars)}
        </p>
      </div>
      <p className="text-xs text-ink/50">
        {hotel.area}
        {destName ? ` · ${destName}` : ""}
      </p>
      <p className="text-sm text-ink/70 leading-relaxed flex-1">{hotel.blurb}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm">
        {hotel.website && (
          <a
            href={hotel.website}
            target="_blank"
            rel="noopener"
            className="link-gold text-ocean font-medium"
          >
            Website
          </a>
        )}
        <a
          href={bookingUrl(hotel.name)}
          target="_blank"
          rel="noopener"
          className="link-gold text-ocean font-medium"
        >
          Booking.com
        </a>
        <a
          href={tripUrl(hotel.name)}
          target="_blank"
          rel="noopener"
          className="link-gold text-ocean font-medium"
        >
          TripAdvisor
        </a>
      </div>
    </article>
  );
}

export default function Stays() {
  const [destFilter, setDestFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("any");

  const allHotels = useMemo<HotelWithDest[]>(() => {
    const seen = new Map<string, HotelWithDest>();
    for (const d of content.destinations) {
      for (const h of d.hotels) {
        if (!seen.has(h.name)) {
          seen.set(h.name, { ...h, destName: d.name });
        }
      }
    }
    return [...seen.values()];
  }, []);

  const destNames = useMemo(
    () => content.destinations.map((d) => d.name),
    []
  );

  const filtered = useMemo(
    () =>
      allHotels.filter(
        (h) =>
          (destFilter === "all" || h.destName === destFilter) &&
          (starFilter === "any" || h.stars === Number(starFilter))
      ),
    [allHotels, destFilter, starFilter]
  );

  return (
    <section id="stays" className="bg-sand py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
          Stays
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">
          Handpicked hotels
        </h2>
        <p className="text-ink/60 mt-4 max-w-2xl">
          Places we know personally — the bed, the breakfast and the view all
          checked by an Ariva guide. Pick your own or let your tier decide.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <label className="flex items-center gap-3 text-sm text-ink/70">
            <span className="font-medium">Destination</span>
            <select
              value={destFilter}
              onChange={(e) => setDestFilter(e.target.value)}
              className="bg-cream border border-ink/15 rounded-full px-4 py-2 text-sm text-ink focus:outline-none focus:border-gold"
            >
              <option value="all">All destinations</option>
              {destNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3 text-sm text-ink/70">
            <span className="font-medium">Stars</span>
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="bg-cream border border-ink/15 rounded-full px-4 py-2 text-sm text-ink focus:outline-none focus:border-gold"
            >
              <option value="any">Any</option>
              <option value="5">5 star</option>
              <option value="4">4 star</option>
              <option value="3">3 star</option>
            </select>
          </label>
        </div>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filtered.map((h) => (
              <HotelCard key={h.name} hotel={h} destName={h.destName} />
            ))}
          </div>
        ) : (
          <p className="text-ink/50 mt-10">
            No hotels match those filters yet — try widening your search.
          </p>
        )}
      </div>
    </section>
  );
}
