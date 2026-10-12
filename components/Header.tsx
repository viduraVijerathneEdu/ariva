"use client";

import { useEffect, useState } from "react";
import { useSite } from "../lib/site";

const NAV_LINKS = [
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "Plan", href: "#plan" },
  { label: "Guides", href: "#guides" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { currency, setCurrencyCode, allCurrencies } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur border-b border-white/10" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <a href="#" className="flex items-center gap-2.5" aria-label="Ariva Travel home">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path
              d="M2 15c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-gold"
            />
            <path
              d="M2 20c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-gold"
              opacity="0.5"
            />
            <path
              d="M2 10c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-gold"
              opacity="0.25"
            />
          </svg>
          <span className="leading-none">
            <span className="font-display text-cream text-xl block">Ariva</span>
            <span className="text-cream/60 tracking-[0.3em] text-[0.6rem] block mt-0.5">
              TRAVEL
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-cream/80 hover:text-cream text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <select
            value={currency.code}
            onChange={(e) => setCurrencyCode(e.target.value)}
            aria-label="Currency"
            className="bg-ink text-cream text-sm border border-white/15 rounded-lg px-2.5 py-2 cursor-pointer"
          >
            {allCurrencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
          <a
            href="#plan"
            className="bg-gold text-ink text-sm font-semibold px-5 py-2.5 rounded-full hover:brightness-110 transition"
          >
            Plan my trip
          </a>
        </div>

        <button
          className="md:hidden text-cream p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-ink/95 backdrop-blur border-b border-white/10">
          <nav className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-cream/80 hover:text-cream text-base py-2.5 border-b border-white/5 last:border-0 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-3">
              <select
                value={currency.code}
                onChange={(e) => setCurrencyCode(e.target.value)}
                aria-label="Currency"
                className="bg-ink text-cream text-sm border border-white/15 rounded-lg px-2.5 py-2 cursor-pointer"
              >
                {allCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <a
                href="#plan"
                onClick={() => setOpen(false)}
                className="bg-gold text-ink text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                Plan my trip
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
