export type Vibe = "cultural" | "wildlife" | "adventure" | "spiritual" | "economy";

export interface Activity {
  name: string;
  description: string;
  vibes: Vibe[];
}

export interface Hotel {
  name: string;
  stars: number;
  area: string;
  blurb: string;
  website?: string;
}

export interface Business {
  name: string;
  type: string;
  blurb: string;
}

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  order: number;
  driveFromAirport: string;
  activities: Activity[];
  hotels: Hotel[];
  businesses: Business[];
}

export interface TierInfo {
  id: "silver" | "gold" | "platinum";
  name: string;
  tagline: string;
  lunch: string;
  transport: string;
  guide: string;
  accommodation: string;
  idealFor: string;
  highlights: string[];
  hotelChoiceNote: string;
}

export interface VibePackage {
  id: Vibe;
  name: string;
  tagline: string;
  description: string;
  image: string;
  comingSoon?: boolean;
  sampleItinerary: string[];
  includesCoastal?: boolean;
}

export interface GuideReview {
  author: string;
  country: string;
  rating: number;
  text: string;
}

export interface Guide {
  id: string;
  name: string;
  role: string;
  languages: string[];
  specialties: string[];
  years: number;
  rating: number;
  tours: number;
  photo: string;
  bio: string;
  reviews: GuideReview[];
}

export interface Testimonial {
  author: string;
  country: string;
  rating: number;
  text: string;
  source: "Google" | "TripAdvisor";
}

export interface SiteContent {
  site: {
    name: string;
    tagline: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    video?: string;
  };
  whyAriva: { title: string; points: { title: string; text: string }[] };
  destinations: Destination[];
  tiers: TierInfo[];
  vibes: VibePackage[];
  guides: Guide[];
  testimonials: Testimonial[];
  businesses: Business[];
  faqs: { q: string; a: string }[];
}
