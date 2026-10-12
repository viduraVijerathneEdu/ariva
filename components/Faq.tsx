"use client";

import { useState } from "react";
import raw from "../data/content.json";
import type { SiteContent } from "../data/types";

const content = raw as unknown as SiteContent;

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-cream py-24">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
          Good to know
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">
          Questions, answered
        </h2>

        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {content.faqs.map((f, i) => {
            const open = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-xl text-ink">{f.q}</span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full border border-gold/50 text-gold flex items-center justify-center text-xl transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-ink/70 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
