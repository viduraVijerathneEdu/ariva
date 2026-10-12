"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import raw from "../data/content.json";
import type {
  Activity,
  SiteContent,
  TierInfo,
  Vibe,
} from "../data/types";
import { useSite } from "../lib/site";
import { estimateTotal, type TierId } from "../lib/pricing";

const content = raw as unknown as SiteContent;

const sortedDestinations = [...content.destinations].sort(
  (a, b) => a.order - b.order
);

function StepHeading({
  n,
  title,
  hint,
}: {
  n: number;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-2xl text-ink">
        <span className="mr-2 text-gold">{n}.</span> {title}
      </h3>
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
    </div>
  );
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
};

export default function Builder() {
  const { formatUSD, currency, preferredLang } = useSite();
  const [tier, setTier] = useState<TierId>("gold");
  const [days, setDays] = useState(7);
  const [destSlugs, setDestSlugs] = useState<string[]>([]);
  const [activities, setActivities] = useState<Record<string, string[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const vibe = (e as CustomEvent).detail as Vibe;
      setDestSlugs(
        content.destinations
          .filter((d) => d.activities.some((a) => a.vibes.includes(vibe)))
          .map((d) => d.slug)
      );
      setActivities({});
      setSubmitted(false);
    };
    window.addEventListener("ariva:vibe", handler);
    return () => window.removeEventListener("ariva:vibe", handler);
  }, []);

  const toggleDestination = (slug: string) => {
    const isSelected = destSlugs.includes(slug);
    setDestSlugs(
      isSelected ? destSlugs.filter((s) => s !== slug) : [...destSlugs, slug]
    );
    if (isSelected) {
      setActivities((acts) => {
        const next = { ...acts };
        delete next[slug];
        return next;
      });
    }
  };

  const toggleActivity = (slug: string, name: string) => {
    setActivities((prev) => {
      const current = prev[slug] ?? [];
      const next = current.includes(name)
        ? current.filter((a) => a !== name)
        : [...current, name];
      return { ...prev, [slug]: next };
    });
  };

  const selectedDests = useMemo(
    () =>
      sortedDestinations.filter((d) => destSlugs.includes(d.slug)),
    [destSlugs]
  );

  const activityCount = useMemo(
    () => Object.values(activities).reduce((n, arr) => n + arr.length, 0),
    [activities]
  );

  const suggestions = useMemo(() => {
    const vibeFreq: Partial<Record<Vibe, number>> = {};
    for (const slug of destSlugs) {
      const dest = content.destinations.find((d) => d.slug === slug);
      if (!dest) continue;
      for (const name of activities[slug] ?? []) {
        const act = dest.activities.find((a) => a.name === name);
        act?.vibes.forEach((v) => {
          vibeFreq[v] = (vibeFreq[v] ?? 0) + 1;
        });
      }
    }
    if (Object.keys(vibeFreq).length === 0) return [];
    type Candidate = { destSlug: string; activity: Activity; score: number };
    const candidates: Candidate[] = [];
    for (const slug of destSlugs) {
      const dest = content.destinations.find((d) => d.slug === slug);
      if (!dest) continue;
      const picked = new Set(activities[slug] ?? []);
      for (const act of dest.activities) {
        if (picked.has(act.name)) continue;
        const score = act.vibes.reduce(
          (n, v) => n + (vibeFreq[v] ?? 0),
          0
        );
        if (score > 0) candidates.push({ destSlug: slug, activity: act, score });
      }
    }
    candidates.sort((a, b) => b.score - a.score);
    return candidates.slice(0, 6);
  }, [destSlugs, activities]);

  const tierInfo: TierInfo =
    content.tiers.find((t) => t.id === tier) ?? content.tiers[1];
  const total = estimateTotal(tier, days, destSlugs.length, activityCount);

  const setField =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <section id="plan" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold">
          Trip customiser
        </p>
        <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Build your journey
        </h2>
        <p className="mt-4 max-w-2xl text-ink/65">
          Pick a tier, tell us your days, choose places and activities. One
          total price — individual activity prices are never shown.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            {/* Step 1 — Tier */}
            <div>
              <StepHeading n={1} title="Choose your tier" />
              <div className="grid gap-4 sm:grid-cols-3">
                {content.tiers.map((t) => {
                  const selected = t.id === tier;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id as TierId)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-gold bg-white ring-2 ring-gold"
                          : "border-ink/15 bg-white/60 hover:border-gold/60"
                      }`}
                      aria-pressed={selected}
                    >
                      <p className="font-display text-xl text-ink">{t.name}</p>
                      <p className="mt-1 text-sm text-ink/60">{t.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 — Days */}
            <div>
              <StepHeading n={2} title="How many days?" />
              <div className="flex items-center gap-6">
                <input
                  type="range"
                  min={3}
                  max={21}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full max-w-md accent-gold"
                  aria-label="Trip length in days"
                />
                <span className="font-display text-3xl text-ink">
                  {days} <span className="text-lg text-ink/60">days</span>
                </span>
              </div>
            </div>

            {/* Step 3 — Destinations */}
            <div>
              <StepHeading
                n={3}
                title="Where do you want to go?"
                hint="Tap to select — you can pick as many as you like."
              />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {sortedDestinations.map((d) => {
                  const selected = destSlugs.includes(d.slug);
                  return (
                    <button
                      key={d.slug}
                      onClick={() => toggleDestination(d.slug)}
                      className={`overflow-hidden rounded-2xl border bg-white text-left transition ${
                        selected
                          ? "border-gold ring-2 ring-gold"
                          : "border-ink/10 hover:border-gold/50"
                      }`}
                      aria-pressed={selected}
                    >
                      <div className="relative h-24">
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                      <p className="px-3 py-2.5 text-sm font-medium text-ink">
                        {d.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4 — Activities */}
            <div>
              <StepHeading
                n={4}
                title="What do you want to do?"
                hint="Pick activities in each of your destinations."
              />
              {selectedDests.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ink/20 bg-white/50 p-6 text-sm text-ink/60">
                  Select at least one destination above to choose activities.
                </p>
              ) : (
                <div className="space-y-6">
                  {selectedDests.map((d) => (
                    <div key={d.slug}>
                      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-ink/70">
                        {d.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {d.activities.map((a) => {
                          const selected = (activities[d.slug] ?? []).includes(
                            a.name
                          );
                          return (
                            <button
                              key={a.name}
                              onClick={() => toggleActivity(d.slug, a.name)}
                              className={`rounded-full px-4 py-2 text-sm transition ${
                                selected
                                  ? "bg-ink text-cream"
                                  : "border border-ink/20 bg-white text-ink/70 hover:border-ink/50"
                              }`}
                              aria-pressed={selected}
                            >
                              {a.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {suggestions.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-ink">
                        Suggestions for you
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map(({ destSlug, activity }) => (
                          <button
                            key={`${destSlug}-${activity.name}`}
                            onClick={() =>
                              toggleActivity(destSlug, activity.name)
                            }
                            className="rounded-full border border-dashed border-gold bg-gold/10 px-4 py-2 text-sm text-ink transition hover:bg-gold/25"
                          >
                            + Add {activity.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Step 5 — Summary */}
          <div>
            <div className="rounded-2xl bg-ink p-6 text-cream lg:sticky lg:top-24">
              <h3 className="font-display text-2xl text-goldlight">
                Your journey
              </h3>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-cream/60">Tier</dt>
                  <dd className="font-medium">{tierInfo.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cream/60">Days</dt>
                  <dd className="font-medium">{days}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cream/60">Destinations</dt>
                  <dd className="font-medium">{destSlugs.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cream/60">Activities</dt>
                  <dd className="font-medium">{activityCount}</dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-cream/60">Estimated total</p>
                <p className="mt-1 font-display text-4xl text-goldlight">
                  {formatUSD(total)}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-cream/60">
                  Estimated total for 2 guests in {currency.code}. Final quote
                  confirmed personally by our team — no payment is taken
                  online.
                </p>
              </div>

              {!submitted ? (
                <>
                  {!showForm ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-6 w-full rounded-xl bg-gold px-6 py-3.5 font-medium text-ink transition hover:brightness-110"
                    >
                      Send my trip to Ariva
                    </button>
                  ) : (
                    <form
                      className="mt-6 space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                    >
                      <input
                        required
                        value={form.name}
                        onChange={setField("name")}
                        placeholder="Full name"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
                      />
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={setField("email")}
                        placeholder="Email"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
                      />
                      <input
                        value={form.phone}
                        onChange={setField("phone")}
                        placeholder="Phone / WhatsApp"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
                      />
                      <input
                        value={form.country}
                        onChange={setField("country")}
                        placeholder="Country"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
                      />
                      <textarea
                        value={form.notes}
                        onChange={setField("notes")}
                        placeholder="Anything we should know? (occasions, dietary needs, pace…)"
                        rows={3}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
                      />
                      {preferredLang && (
                        <p className="text-xs text-cream/60">
                          Preferred language: {preferredLang}
                        </p>
                      )}
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-gold px-6 py-3.5 font-medium text-ink transition hover:brightness-110"
                      >
                        Request callback
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <div className="mt-6 rounded-xl bg-gold/10 p-5 text-center">
                  <p className="font-medium text-goldlight">
                    Request received!
                  </p>
                  <p className="mt-2 text-sm text-cream/70">
                    We&apos;ll call you back within 24 hours to fine-tune every
                    detail.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
