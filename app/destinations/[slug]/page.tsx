import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import raw from "../../../data/content.json";
import type { SiteContent } from "../../../data/types";
import { HotelCard } from "../../../components/Stays";

const content = raw as unknown as SiteContent;

const vibeNames = new Map(content.vibes.map((v) => [v.id, v.name]));

export async function generateStaticParams() {
  const c = (
    await import("../../../data/content.json")
  ).default as unknown as SiteContent;
  return c.destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = content.destinations.find((d) => d.slug === slug);
  return { title: `${dest ? dest.name : "Destination"} | Ariva Travel` };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = content.destinations.find((d) => d.slug === slug);
  if (!dest) notFound();

  const journeys = content.vibes.filter((v) => !v.comingSoon);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[24rem]">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 pb-10">
            <a
              href="/#destinations"
              className="text-sm text-cream/70 hover:text-goldlight transition-colors"
            >
              ← All destinations
            </a>
            <h1 className="font-display text-5xl text-cream mt-3">{dest.name}</h1>
            <p className="text-goldlight text-lg mt-2">{dest.tagline}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <p className="text-ink/70 leading-relaxed text-lg">
              {dest.description}
            </p>

            {dest.gallery && dest.gallery.length > 0 && (
              <>
                <h2 className="font-display text-3xl text-ink mt-12">
                  Moments from {dest.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {dest.gallery.map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl group"
                    >
                      <Image
                        src={src}
                        alt={`${dest.name} — guest photo`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="font-display text-3xl text-ink mt-12">Experiences</h2>
            <div className="grid sm:grid-cols-2 gap-5 mt-6">
              {dest.activities.map((a) => (
                <article
                  key={a.name}
                  className="bg-sand rounded-2xl border border-ink/10 p-5"
                >
                  <h3 className="font-semibold text-ink">{a.name}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed mt-2">
                    {a.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {a.vibes.map((v) => (
                      <span
                        key={v}
                        className="text-xs border border-gold/50 text-gold rounded-full px-3 py-1"
                      >
                        {vibeNames.get(v) ?? v}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {dest.hotels.length > 0 && (
              <>
                <h2 className="font-display text-3xl text-ink mt-12">
                  Where to stay
                </h2>
                <div className="grid sm:grid-cols-2 gap-5 mt-6">
                  {dest.hotels.map((h) => (
                    <HotelCard key={h.name} hotel={h} />
                  ))}
                </div>
              </>
            )}

            {dest.businesses.length > 0 && (
              <>
                <h2 className="font-display text-3xl text-ink mt-12">
                  Local businesses
                </h2>
                <ul className="mt-6 space-y-4">
                  {dest.businesses.map((b) => (
                    <li
                      key={b.name}
                      className="bg-sand rounded-2xl border border-ink/10 p-5"
                    >
                      <p className="text-xs uppercase tracking-widest text-gold font-semibold">
                        {b.type}
                      </p>
                      <p className="font-display text-lg text-ink mt-1">
                        {b.name}
                      </p>
                      <p className="text-sm text-ink/60 mt-1">{b.blurb}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Aside */}
          <aside>
            <div className="sticky top-24 bg-ink text-cream rounded-2xl p-6">
              <h2 className="font-display text-2xl">Journeys that fit</h2>
              <ul className="mt-4 space-y-4">
                {journeys.map((v) => (
                  <li key={v.id}>
                    <a href="/#packages" className="block group">
                      <p className="font-semibold text-goldlight group-hover:text-gold transition-colors">
                        {v.name}
                      </p>
                      <p className="text-sm text-cream/60">{v.tagline}</p>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="/#plan"
                className="block text-center mt-6 bg-gold text-ink font-semibold rounded-full px-8 py-3 hover:bg-goldlight transition-colors"
              >
                Add to my trip
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
