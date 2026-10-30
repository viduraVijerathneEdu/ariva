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

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[22rem]">
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
            <Link
              href={`/destinations/${dest.slug}`}
              className="text-sm text-cream/70 hover:text-goldlight transition-colors"
            >
              ← {dest.name}
            </Link>
            <h1 className="font-display text-5xl text-cream mt-3">
              {act.name}
            </h1>
            <p className="text-goldlight text-lg mt-2">
              An experience in {dest.name}
            </p>
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

            {dest.gallery && dest.gallery.length > 0 && (
              <>
                <Reveal>
                  <h2 className="font-display text-3xl text-ink mt-12">
                    Moments from {dest.name}
                  </h2>
                </Reveal>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {dest.gallery.map((src, i) => (
                    <div
                      key={src}
                      className="relative h-48 overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={src}
                        alt={`${dest.name} photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
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
    </main>
  );
}
