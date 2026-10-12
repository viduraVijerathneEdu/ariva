import raw from "../data/content.json";
import type { SiteContent } from "../data/types";

const content = raw as unknown as SiteContent;

export default function WhyAriva() {
  const { title, points } = content.whyAriva;

  return (
    <section className="bg-sand py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-4xl text-ink">{title}</h2>
          <p className="text-ink/60 mt-4">
            Thoughtfully designed journeys, local expertise, and honest pricing —
            that is the Ariva way to see Sri Lanka.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="bg-cream rounded-2xl p-6 border border-ink/10"
            >
              <p className="text-gold text-sm font-semibold tracking-widest mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-semibold text-ink mb-2">{p.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
