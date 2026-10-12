import raw from "../data/content.json";
import type { SiteContent } from "../data/types";

const content = raw as unknown as SiteContent;

const exploreLinks = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Packages", href: "/#packages" },
  { label: "Plan my trip", href: "/#plan" },
  { label: "Stays", href: "/#stays" },
  { label: "Guides", href: "/#guides" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export default function Footer() {
  const { site } = content;
  return (
    <footer id="contact" className="bg-deep text-cream py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <p className="font-display text-3xl text-goldlight">{site.name}</p>
            <p className="text-sm text-cream/60 mt-2">{site.tagline}</p>
            <p className="text-sm text-cream/60 mt-4 leading-relaxed">
              Bespoke Sri Lanka journeys — safaris, surf, heritage and
              everything in between, designed around you.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-goldlight transition-colors">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener"
                  className="hover:text-goldlight transition-colors"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-goldlight transition-colors">
                  {site.email}
                </a>
              </li>
              <li className="text-cream/60">{site.address}</li>
            </ul>
            <a
              href="https://wa.me/94702592679"
              target="_blank"
              rel="noopener"
              className="inline-block mt-6 bg-gold text-ink font-semibold rounded-full px-8 py-3 hover:bg-goldlight transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream/80 hover:text-goldlight transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10 mt-12 pt-6">
          <p className="text-xs text-cream/40">
            © 2026 Ariva Travel · Prices shown are estimates in your local
            currency · Final quotes confirmed personally.
          </p>
        </div>
      </div>
    </footer>
  );
}
