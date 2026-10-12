import Image from "next/image";
import raw from "../data/content.json";
import type { SiteContent } from "../data/types";

const content = raw as unknown as SiteContent;

export default function Hero() {
  const hero = content.hero;
  const video = (hero as { video?: string }).video;
  const destCount = content.destinations.length;
  const activityCount = content.destinations.reduce(
    (sum, d) => sum + d.activities.length,
    0
  );
  const journeyStyles = content.vibes.length;

  const stats: { value: string; label: string }[] = [
    { value: String(destCount), label: "Destinations" },
    { value: String(activityCount), label: "Activities" },
    { value: String(journeyStyles), label: "Journey styles" },
  ];

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-ink">
      {video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero.image}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          priority
          className="object-cover animate-kenburns"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="text-gold tracking-[0.35em] uppercase text-xs mb-5">
          {hero.eyebrow}
        </p>
        <h1 className="font-display text-cream text-5xl md:text-7xl leading-[1.05] max-w-3xl">
          {hero.title}
        </h1>
        <p className="text-cream/80 max-w-2xl mt-5 text-lg">{hero.subtitle}</p>

        <div className="flex flex-wrap gap-4 mt-8">
          <a
            href="#plan"
            className="bg-gold text-ink font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition"
          >
            Plan my trip
          </a>
          <a
            href="#destinations"
            className="border border-white/40 text-cream px-7 py-3.5 rounded-full hover:border-cream hover:bg-white/5 transition"
          >
            Explore destinations
          </a>
        </div>

        <div className="border-t border-white/15 pt-6 mt-10 flex gap-10 flex-wrap">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl text-cream">{s.value}</p>
              <p className="text-cream/60 text-xs uppercase tracking-wider mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
