import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import raw from "../../../../../data/content.json";
import type { SiteContent } from "../../../../../data/types";
import Reveal from "../../../../../components/Reveal";

const content = raw as unknown as SiteContent;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const vibeNames = new Map(content.vibes.map((v) => [v.id, v.name]));

export async function generateStaticParams() {
  const c = (
    await import("../../../../../data/content.json")
  ).default as unknown as SiteContent;
  return c.destinations.flatMap((d) =>
    d.activities.map((a) => ({
      slug: d.slug,
      experience: slugify(a.name),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; experience: string }>;
}): Promise<Metadata> {
  const { slug, experience } = await params;
  const dest = content.destinations.find((d) => d.slug === slug);
  const act = dest?.activities.find((a) => slugify(a.name) === experience);
  return {
    title: `${act ? act.name : "Experience"} in ${dest ? dest.name : "Sri Lanka"} | Ariva Travel`,
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string; experience: string }>;
}) {
  const { slug, experience } = await params;
  const dest = content.destinations.find((d) => d.slug === slug);
  const act = dest?.activities.find((a) => slugify(a.name) === experience);
  if (!dest || !act) notFound();

  // Gallery: the destination's own photos first, then photos from
  // destinations sharing this activity's vibes, so every experience
  // page has a gallery even when the destination itself has few photos.
  const galleryPool: string[] = [];
  const pushUnique = (src: string) => {
    if (src && !galleryPool.includes(src)) galleryPool.push(src);
  };
  (dest.gallery ?? []).forEach(pushUnique);
  const actVibes = new Set(act.vibes);
  const similar = content.destinations
    .filter((d) => d.slug !== dest.slug)
    .map((d) => ({
      d,
      overlap: d.activities.reduce(
        (n, a) => n + a.vibes.filter((v) => actVibes.has(v)).length,
        0
      ),
    }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);
  for (const { d } of similar) {
    pushUnique(d.image);
    (d.gallery ?? []).forEach(pushUnique);
    if (galleryPool.length >= 5) break;
  }
  const gallery = galleryPool.slice(0, 5);
  const galleryAllOwn =
    gallery.length > 0 &&
    gallery.every((src) => (dest.gallery ?? []).includes(src));

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[68vh] min-h-[26rem]">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/40 to-deep/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 pb-12">
            <Link
              href={`/destinations/${dest.slug}`}
              className="text-sm text-cream/70 hover:text-goldlight transition-colors"
            >
              ← {dest.name}
            </Link>
            <h1 className="font-display text-5xl sm:text-6xl text-cream mt-3 max-w-3xl leading-tight">
              {act.name}
            </h1>
            <p className="text-goldlight text-lg mt-2">
              An experience in {dest.name}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {act.vibes.map((v) => (
                <span
                  key={v}
                  className="text-xs bg-white/15 backdrop-blur border border-white/25 text-cream rounded-full px-3 py-1"
                >
                  {vibeNames.get(v) ?? v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <p className="text-ink/70 leading-relaxed text-lg">
              {act.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {act.vibes.map((v) => (
                <span
                  key={v}
                  className="text-xs border border-gold/50 text-gold rounded-full px-3 py-1"
                >
                  {vibeNames.get(v) ?? v}
                </span>
              ))}
            </div>

            {gallery.length > 0 && (
              <>
                <Reveal>
                  <h2 className="font-display text-3xl text-ink mt-12">
                    {galleryAllOwn
                      ? `Moments from ${dest.name}`
                      : "Moments from Sri Lanka"}
                  </h2>
                  <p className="text-sm text-ink/60 mt-2">
                    {galleryAllOwn
                      ? `Scenes from around ${dest.name} — the landscapes, light and life this experience moves through.`
                      : `Scenes from ${dest.name} and similar island journeys — the landscapes, light and life this kind of experience moves through.`}
                  </p>
                </Reveal>
                <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[180px] gap-4 mt-6">
                  {gallery.map((src, i) => (
                    <div
                      key={src}
                      className={`group relative overflow-hidden rounded-3xl shadow-sm ${
                        i === 0 ? "col-span-2 sm:row-span-2" : ""
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`Sri Lanka photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Aside */}
          <aside>
            <Reveal>
              <div className="sticky top-24 bg-ink text-cream rounded-2xl p-6">
                <h2 className="font-display text-2xl">Plan this experience</h2>
                <p className="text-sm text-cream/60 mt-3 leading-relaxed">
                  {act.name} is one of the experiences in {dest.name}. See
                  the full destination page for where to stay, local
                  businesses and every other experience there.
                </p>
                <dl className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                  <div>
                    <dt className="text-cream/50 text-xs uppercase tracking-widest">
                      Destination
                    </dt>
                    <dd className="mt-1">{dest.name} — {dest.tagline}</dd>
                  </div>
                  <div>
                    <dt className="text-cream/50 text-xs uppercase tracking-widest">
                      From the airport
                    </dt>
                    <dd className="mt-1">{dest.driveFromAirport}</dd>
                  </div>
                </dl>
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="block text-center mt-6 bg-gold text-ink font-semibold rounded-full px-8 py-3 hover:bg-goldlight transition-colors"
                >
                  More information →
                </Link>
                <Link
                  href="/#plan"
                  className="block text-center mt-3 border border-cream/30 text-cream font-semibold rounded-full px-8 py-3 hover:border-goldlight hover:text-goldlight transition-colors"
                >
                  Add to my trip
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* More experiences in this destination */}
      {dest.activities.filter((a) => a.name !== act.name).length > 0 && (
        <section className="bg-cream pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="font-display text-3xl text-ink">
                More experiences in {dest.name}
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {dest.activities
                .filter((a) => a.name !== act.name)
                .map((a) => (
                  <Link
                    key={a.name}
                    href={`/destinations/${dest.slug}/experiences/${slugify(a.name)}`}
                    className="lift bg-sand rounded-2xl border border-ink/10 p-5 block"
                  >
                    <h3 className="font-semibold text-ink">{a.name}</h3>
                    <p className="text-sm text-ink/60 leading-relaxed mt-2 line-clamp-2">
                      {a.description}
                    </p>
                    <p className="mt-3 text-sm font-medium text-gold">
                      View details →
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
