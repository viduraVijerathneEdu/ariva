"use client";

import { useState } from "react";
import Image from "next/image";
import raw from "../data/content.json";
import type { SiteContent } from "../data/types";
import Reveal from "./Reveal";

const content = raw as unknown as SiteContent;

function Stars({ n }: { n: number }) {
  return (
    <span className="text-gold text-sm" aria-label={`${n} out of 5`}>
      {"★".repeat(n)}
      {"☆".repeat(Math.max(0, 5 - n))}
    </span>
  );
}

function GuideSignup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-goldlight font-medium">
        Application received — we&apos;ll verify and publish your profile.
      </p>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-gold text-ink font-semibold rounded-full px-8 py-3 hover:bg-goldlight transition-colors"
        >
          Create guide account
        </button>
      ) : (
        <form
          className="grid sm:grid-cols-2 gap-4 mt-2 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            required
            name="name"
            placeholder="Full name"
            className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
          />
          <input
            required
            name="contact"
            placeholder="Phone or email"
            className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
          />
          <input
            required
            name="languages"
            placeholder="Languages (e.g. English, German)"
            className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
          />
          <input
            required
            name="specialties"
            placeholder="Specialties (e.g. wildlife, surf)"
            className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
          />
          <textarea
            required
            name="bio"
            placeholder="Tell travellers about yourself"
            rows={3}
            className="sm:col-span-2 bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-gold text-ink font-semibold rounded-full px-8 py-3 hover:bg-goldlight transition-colors"
            >
              Submit application
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Guides() {
  return (
    <section id="guides" className="scroll-mt-20 bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
<p className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
          Guides
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">
          Choose your guide
        </h2>
        <p className="text-ink/60 mt-4 max-w-2xl">
          Every Ariva guide has a public profile. Pick your favourite when you
          book — your guide builds their own reputation here.
        </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {content.guides.map((g, i) => (
            <Reveal key={g.id} delay={(i % 3) * 100}>
            <article
              className="lift bg-sand rounded-2xl border border-ink/10 overflow-hidden h-full"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={g.photo}
                  alt={g.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-ink">{g.name}</h3>
                <p className="text-sm text-ink/50 mt-1">
                  {g.role} · {g.years} years
                </p>
                <p className="flex items-center gap-2 mt-2 text-sm text-ink/70">
                  <Stars n={Math.round(g.rating)} />
                  <span className="font-semibold text-ink">
                    {g.rating.toFixed(1)}
                  </span>
                  <span>({g.tours} tours)</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {g.languages.map((l) => (
                    <span
                      key={l}
                      className="text-xs bg-ink/5 text-ink/70 rounded-full px-3 py-1"
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {g.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs border border-gold/50 text-gold rounded-full px-3 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-ink/70 leading-relaxed mt-4">
                  {g.bio}
                </p>
                {g.reviews.length > 0 && (
                  <div className="mt-5 space-y-4 border-t border-ink/10 pt-5">
                    {g.reviews.map((r, i) => (
                      <blockquote key={i}>
                        <p className="text-sm italic text-ink/70">
                          &ldquo;{r.text}&rdquo;
                        </p>
                        <footer className="flex items-center justify-between mt-2">
                          <span className="text-xs text-ink/50">
                            {r.author} · {r.country}
                          </span>
                          <Stars n={r.rating} />
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </article>
            </Reveal>
          ))}
        </div>

        <div className="bg-ink text-cream rounded-2xl p-8 md:p-12 mt-16 text-center">
          <h3 className="font-display text-3xl">
            Are you a guide? Join Ariva
          </h3>
          <p className="text-cream/70 mt-3 max-w-xl mx-auto">
            Build your public profile, collect reviews and get booked directly
            by travellers. Applications are verified before publishing.
          </p>
          <div className="mt-6 flex justify-center">
            <GuideSignup />
          </div>
        </div>
      </div>
    </section>
  );
}
