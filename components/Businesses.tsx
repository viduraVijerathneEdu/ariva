import raw from "../data/content.json";
import type { SiteContent } from "../data/types";

const content = raw as unknown as SiteContent;

export default function Businesses() {
  return (
    <section id="businesses" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-[0.3em]">
          Community
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">
          Local businesses
        </h2>
        <p className="text-ink/60 mt-4 max-w-2xl">
          The gem cutters, spice growers and craftspeople who make Sri Lanka
          special — Ariva travellers meet them face to face.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {content.businesses.map((b) => (
            <article
              key={b.name}
              className="bg-sand rounded-2xl border border-ink/10 p-6"
            >
              <p className="text-xs uppercase tracking-widest text-gold font-semibold">
                {b.type}
              </p>
              <h3 className="font-display text-xl text-ink mt-2">{b.name}</h3>
              <p className="text-sm text-ink/70 leading-relaxed mt-2">
                {b.blurb}
              </p>
            </article>
          ))}
        </div>

        <p className="text-sm text-ink/50 mt-8">
          Every visit is arranged through Ariva — ask us when you plan your
          trip.
        </p>
      </div>
    </section>
  );
}
