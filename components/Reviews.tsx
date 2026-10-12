import raw from "../data/content.json";
import type { SiteContent } from "../data/types";
import Reveal from "./Reveal";

const content = raw as unknown as SiteContent;

export default function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 bg-sand py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
<p className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
          Word of mouth
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">
          Guest reviews
        </h2>
        <p className="text-ink/60 mt-4 max-w-2xl">
          Real trips, real travellers. We publish every review we receive.
        </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {content.testimonials.map((t, i) => (
            <Reveal key={i} delay={(i % 2) * 100}>
            <figure
              className="lift bg-cream rounded-2xl border border-ink/10 p-8 flex flex-col gap-4 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-gold text-lg" aria-label={`${t.rating} out of 5`}>
                  {"★".repeat(t.rating)}
                </span>
                <span className="text-xs uppercase tracking-widest text-ink/40 border border-ink/15 rounded-full px-3 py-1">
                  {t.source}
                </span>
              </div>
              <blockquote className="text-ink/80 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="text-sm text-ink/50">
                {t.author} · {t.country}
              </figcaption>
            </figure>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-10">
          <a
            href="https://www.google.com/maps/search/Ariva+Travel+Sri+Lanka"
            target="_blank"
            rel="noopener"
            className="border border-ink/30 text-ink rounded-full px-8 py-3 font-medium hover:border-gold hover:text-gold transition-colors"
          >
            Review us on Google
          </a>
          <a
            href="https://www.tripadvisor.com/Search?q=Ariva+Travel+Sri+Lanka"
            target="_blank"
            rel="noopener"
            className="border border-ink/30 text-ink rounded-full px-8 py-3 font-medium hover:border-gold hover:text-gold transition-colors"
          >
            Review us on TripAdvisor
          </a>
        </div>
      </div>
    </section>
  );
}
