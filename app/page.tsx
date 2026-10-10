"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const HERO_FRAME_COUNT = 300;
const NEGOMBO_FRAME_COUNT = 240;
const KITULGALA_FRAME_COUNT = 240;
const YAPAHUWA_FRAME_COUNT = 240;
const DAMBULLA_FRAME_COUNT = 300;
const ANURADHAPURA_FRAME_COUNT = 300;
const POLONNARUWA_FRAME_COUNT = 300;
const TRINCOMALEE_FRAME_COUNT = 300;
const KALPITIYA_FRAME_COUNT = 300;
const KANDY_FRAME_COUNT = 300;
const MATALE_FRAME_COUNT = 300;
const NUWARAELIYA_FRAME_COUNT = 300;
const ELLA_FRAME_COUNT = 300;
const BADULLA_FRAME_COUNT = 300;
const YALA_FRAME_COUNT = 300;
const EXISTING_JOURNEY_END = 0.716;

const heroFrameSource = (index: number) =>
  `/frames/ariva-${String(index).padStart(3, "0")}.webp`;
const negomboFrameSource = (index: number) =>
  `/negombo-frames/negombo-${String(index).padStart(3, "0")}.webp`;
const kitulgalaFrameSource = (index: number) =>
  `/kitulgala-frames/kitulgala-${String(index).padStart(3, "0")}.webp`;
const yapahuwaFrameSource = (index: number) =>
  `/yapahuwa-frames/yapahuwa-${String(index).padStart(3, "0")}.webp`;
const dambullaFrameSource = (index: number) =>
  `/dambulla-frames/dambulla-${String(index + 1).padStart(3, "0")}.webp`;
const anuradhapuraFrameSource = (index: number) =>
  `/anuradhapura-frames/anuradhapura-${String(index + 1).padStart(3, "0")}.webp`;
const polonnaruwaFrameSource = (index: number) =>
  `/polonnaruwa-frames/polonnaruwa-${String(index + 1).padStart(3, "0")}.webp`;
const trincomaleeFrameSource = (index: number) =>
  `/trincomalee-frames/trincomalee-${String(index + 1).padStart(3, "0")}.webp`;
const kalpitiyaFrameSource = (index: number) =>
  `/kalpitiya-frames/kalpitiya-${String(index + 1).padStart(3, "0")}.webp`;
const kandyFrameSource = (index: number) =>
  `/kandy-frames/kandy-${String(index + 1).padStart(3, "0")}.webp`;
const mataleFrameSource = (index: number) =>
  `/matale-frames/matale-${String(index + 1).padStart(3, "0")}.webp`;
const nuwaraeliyaFrameSource = (index: number) =>
  `/nuwaraeliya-frames/nuwaraeliya-${String(index + 1).padStart(3, "0")}.webp`;
const ellaFrameSource = (index: number) =>
  `/ella-frames/ella-${String(index + 1).padStart(3, "0")}.webp`;
const badullaFrameSource = (index: number) =>
  `/badulla-frames/badulla-${String(index + 1).padStart(3, "0")}.webp`;
const yalaFrameSource = (index: number) =>
  `/yala-frames/yala-${String(index + 1).padStart(3, "0")}.webp`;

const destinations = [
  {
    name: "Dry fish market",
    localName: "Lellama",
    category: "Cultural",
    image: "/destinations/lellama.webp",
    alt: "Fish being dried along the coast near Negombo",
    description:
      "Walk through the lively morning market where fishing traditions shape daily life.",
  },
  {
    name: "St. Mary's Church",
    localName: "Negombo",
    category: "Cultural",
    image: "/destinations/st-marys.webp",
    alt: "Historic church architecture in Sri Lanka",
    description:
      "Step inside one of Negombo's most treasured landmarks, rich with local history.",
  },
  {
    name: "Negombo lagoon",
    localName: "Boat safari",
    category: "Wildlife",
    image: "/destinations/lagoon.webp",
    alt: "A small boat travelling through a tropical lagoon",
    description:
      "Drift through calm waterways, mangroves and the working heart of the lagoon.",
  },
  {
    name: "Muthurajawela marsh",
    localName: "Boat safari",
    category: "Wildlife",
    image: "/destinations/muthurajawela.webp",
    alt: "A wetland bird beside calm water in Sri Lanka",
    description:
      "Explore a protected wetland alive with birds, reptiles and rare coastal habitats.",
  },
];

const yapahuwaActivities = [
  {
    name: "Yapahuwa rock fortress",
    localName: "Ancient citadel",
    category: "Cultural",
    image: yapahuwaFrameSource(239),
    alt: "The monumental stone staircase at Yapahuwa rock fortress",
    description:
      "Climb through a 13th-century citadel shaped by intricate stonework and royal history.",
  },
  {
    name: "Ridee Viharaya temple",
    localName: "Silver temple",
    category: "Spiritual",
    image: "/destinations/ridee-viharaya.webp",
    alt: "Golden Buddha statues inside an ancient temple",
    description:
      "Discover a sacred cave temple known for centuries of devotion, art and quiet reflection.",
  },
  {
    name: "Sky diving & para jumping",
    localName: "Above Yapahuwa",
    category: "Adventure",
    image: "/destinations/skydiving.webp",
    alt: "A parachutist flying through a bright sky",
    description:
      "See the ancient landscape from above on an exhilarating flight over the cultural heartland.",
  },
];

type SequenceOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  deferUntilProgress?: number;
  frameCount: number;
  frameSource: (index: number) => string;
  onFirstFrameReady?: () => void;
  progressEnd?: number;
  progressProperty?: string;
  progressStart?: number;
  sectionRef: RefObject<HTMLElement | null>;
  useFullProgress?: boolean;
};

function useImageSequence({
  canvasRef,
  deferUntilProgress = 0,
  frameCount,
  frameSource,
  onFirstFrameReady,
  progressEnd = 1,
  progressProperty = "--scroll-progress",
  progressStart = 0,
  sectionRef,
  useFullProgress = false,
}: SequenceOptions) {
  const framesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const currentFrameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const frameRequestRef = useRef<number | null>(null);

  const drawFrame = useCallback(
    (requestedIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const available = framesRef.current[requestedIndex]?.complete
        ? requestedIndex
        : framesRef.current.reduce(
            (nearest, image, index) =>
              image?.complete &&
              Math.abs(index - requestedIndex) <
                Math.abs(nearest - requestedIndex)
                ? index
                : nearest,
            0,
          );
      const image = framesRef.current[available];
      if (!image?.complete || !image.naturalWidth) return;
      if (renderedFrameRef.current === available) return;

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;
      const scale = Math.max(
        canvas.width / image.naturalWidth,
        canvas.height / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        (canvas.width - width) / 2,
        (canvas.height - height) / 2,
        width,
        height,
      );
      renderedFrameRef.current = available;
    },
    [canvasRef],
  );

  useEffect(() => {
    let nextFrame = 1;
    let cancelled = false;
    let loadingStarted = false;

    const firstFrame = new window.Image();
    firstFrame.decoding = "async";
    framesRef.current[0] = firstFrame;
    firstFrame.onload = () => {
      drawFrame(0);
      onFirstFrameReady?.();
    };
    firstFrame.src = frameSource(0);

    const loadNext = () => {
      if (cancelled || nextFrame >= frameCount) return;
      const index = nextFrame++;
      const image = new window.Image();
      image.decoding = "async";
      framesRef.current[index] = image;
      image.onload = () => {
        if (index === currentFrameRef.current) drawFrame(index);
        loadNext();
      };
      image.onerror = loadNext;
      image.src = frameSource(index);
    };

    const startLoading = () => {
      if (loadingStarted) return;
      loadingStarted = true;
      Array.from({ length: 4 }, loadNext);
    };

    const section = sectionRef.current;
    const maybeStartDeferredLoading = () => {
      if (!section) return;
      const maxScroll = section.offsetHeight - window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / maxScroll),
      );
      const timelineProgress = useFullProgress
        ? progress
        : Math.min(1, progress / EXISTING_JOURNEY_END);
      if (timelineProgress >= deferUntilProgress) {
        startLoading();
        window.removeEventListener("scroll", maybeStartDeferredLoading);
      }
    };

    const observer =
      deferUntilProgress === 0 && section && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                startLoading();
                observer?.disconnect();
              }
            },
            { rootMargin: "150% 0px" },
          )
        : null;

    if (observer && section) {
      observer.observe(section);
    } else if (deferUntilProgress > 0) {
      maybeStartDeferredLoading();
      window.addEventListener("scroll", maybeStartDeferredLoading, {
        passive: true,
      });
    } else {
      startLoading();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("scroll", maybeStartDeferredLoading);
    };
  }, [
    deferUntilProgress,
    drawFrame,
    frameCount,
    frameSource,
    onFirstFrameReady,
    sectionRef,
    useFullProgress,
  ]);

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      renderedFrameRef.current = -1;
      drawFrame(currentFrameRef.current);
    };

    const updateFrame = () => {
      frameRequestRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const maxScroll = section.offsetHeight - window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / maxScroll),
      );
      const journeyProgress = Math.min(1, progress / EXISTING_JOURNEY_END);
      const timelineProgress = useFullProgress ? progress : journeyProgress;
      const localProgress = Math.min(
        1,
        Math.max(
          0,
          (timelineProgress - progressStart) / (progressEnd - progressStart),
        ),
      );
      section.style.setProperty("--full-progress", String(progress));
      section.style.setProperty("--journey-progress", String(journeyProgress));
      section.style.setProperty(progressProperty, String(localProgress));
      currentFrameRef.current = Math.round(localProgress * (frameCount - 1));
      drawFrame(currentFrameRef.current);
    };

    const requestFrame = () => {
      if (frameRequestRef.current === null) {
        frameRequestRef.current = window.requestAnimationFrame(updateFrame);
      }
    };

    updateCanvasSize();
    updateFrame();
    window.addEventListener("resize", updateCanvasSize);
    window.addEventListener("scroll", requestFrame, { passive: true });

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("scroll", requestFrame);
      if (frameRequestRef.current !== null) {
        window.cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [
    canvasRef,
    drawFrame,
    frameCount,
    progressEnd,
    progressProperty,
    progressStart,
    sectionRef,
    useFullProgress,
  ]);
}

type HeroProps = {
  isVisible: boolean;
  onFirstFrameReady: () => void;
};

function JourneySequence({ isVisible, onFirstFrameReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const negomboCanvasRef = useRef<HTMLCanvasElement>(null);
  const kitulgalaCanvasRef = useRef<HTMLCanvasElement>(null);
  const yapahuwaCanvasRef = useRef<HTMLCanvasElement>(null);

  useImageSequence({
    canvasRef: heroCanvasRef,
    frameCount: HERO_FRAME_COUNT,
    frameSource: heroFrameSource,
    progressEnd: 0.216,
    progressProperty: "--hero-progress",
    sectionRef,
  });

  useImageSequence({
    canvasRef: yapahuwaCanvasRef,
    deferUntilProgress: 0.62,
    frameCount: YAPAHUWA_FRAME_COUNT,
    frameSource: yapahuwaFrameSource,
    progressEnd: 0.86,
    progressProperty: "--yapahuwa-progress",
    progressStart: 0.716,
    sectionRef,
    useFullProgress: true,
  });

  useImageSequence({
    canvasRef: negomboCanvasRef,
    deferUntilProgress: 0.15,
    frameCount: NEGOMBO_FRAME_COUNT,
    frameSource: negomboFrameSource,
    progressEnd: 0.417,
    progressStart: 0.22,
    progressProperty: "--negombo-progress",
    sectionRef,
  });

  useImageSequence({
    canvasRef: kitulgalaCanvasRef,
    deferUntilProgress: 0.57,
    frameCount: KITULGALA_FRAME_COUNT,
    frameSource: kitulgalaFrameSource,
    progressEnd: 0.87,
    progressProperty: "--kitulgala-progress",
    progressStart: 0.675,
    sectionRef,
  });

  return (
    <section
      className={`sequence sequence--journey${isVisible ? " sequence--visible" : ""}`}
      id="negombo"
      ref={sectionRef}
    >
      <div className="sequence__sticky">
        <Image
          className="sequence__poster"
          src={heroFrameSource(0)}
          alt=""
          fill
          priority
          sizes="100vw"
          onLoad={onFirstFrameReady}
        />
        <canvas
          ref={heroCanvasRef}
          className="sequence__canvas sequence__canvas--hero"
          aria-label="Aerial journey around Colombo Lotus Tower"
        />
        <canvas
          ref={negomboCanvasRef}
          className="sequence__canvas sequence__canvas--negombo"
          aria-label="A journey through the clouds to Negombo beach"
        />
        <canvas
          ref={kitulgalaCanvasRef}
          className="sequence__canvas sequence__canvas--kitulgala"
          aria-label="A river journey through the rainforest in Kitulgala"
        />
        <canvas
          ref={yapahuwaCanvasRef}
          className="sequence__canvas sequence__canvas--yapahuwa"
          aria-label="A journey from the rainforest to Yapahuwa rock fortress"
        />
        <div className="sequence__shade" />

        <header className="site-header">
          <a className="site-logo" href="#" aria-label="Ariva home">
            Ariva
          </a>
          <span className="site-location">Sri Lanka · 06.9271° N</span>
          <a className="site-link" href="#negombo">
            Discover
          </a>
        </header>

        <div className="hero-copy">
          <div className="hero-copy__motion">
            <p>Welcome to Sri Lanka</p>
            <h1>
              Welcome to
              <span>Ariva</span>
            </h1>
          </div>
        </div>

        <div className="hero-end-copy">
          <p>Your journey begins here</p>
          <h2>
            The island
            <span>is calling</span>
          </h2>
        </div>

        <p className="chapter-label">02 · West coast</p>
        <div className="negombo-copy">
          <p>Where the lagoon meets the sea</p>
          <h2>Negombo</h2>
        </div>

        <DestinationsOverlay sectionRef={sectionRef} />

        <p className="kitulgala-chapter">03 · River country</p>
        <div className="kitulgala-copy">
          <p>Follow the river into the wild</p>
          <h2>Kitulgala</h2>
        </div>

        <KitulgalaActivityOverlay sectionRef={sectionRef} />

        <p className="yapahuwa-chapter">04 · Ancient kingdom</p>
        <div className="yapahuwa-copy">
          <p>Climb into a forgotten kingdom</p>
          <h2>Yapahuwa</h2>
        </div>

        <YapahuwaActivitiesOverlay sectionRef={sectionRef} />

        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll to journey</span>
          <i />
        </div>
        <p className="frame-rate">1,020 frames · 30 fps</p>
      </div>
    </section>
  );
}

type ChapterCard = {
  image: string;
  alt: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
};

type ChapterData = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  lede: string;
  frameCount: number;
  frameSource: (index: number) => string;
  card: ChapterCard;
};

function JourneyChapter({ chapter }: { chapter: ChapterData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImageSequence({
    canvasRef,
    frameCount: chapter.frameCount,
    frameSource: chapter.frameSource,
    progressEnd: 1,
    progressProperty: "--chapter-progress",
    progressStart: 0,
    sectionRef,
    useFullProgress: true,
  });

  return (
    <section className="chapter" id={chapter.id} ref={sectionRef}>
      <div className="chapter__sticky">
        <canvas ref={canvasRef} className="chapter__canvas" />
        <div className="chapter__shade" />
        <header className="chapter__header">
          <p className="chapter__eyebrow">
            {chapter.number} · {chapter.eyebrow}
          </p>
          <h2>{chapter.title}</h2>
          <p className="chapter__lede">{chapter.lede}</p>
        </header>
        <div className="chapter__cards">
          <article className="destination-card chapter-card">
            <Image
              src={chapter.card.image}
              alt={chapter.card.alt}
              fill
              sizes="(max-width: 768px) 90vw, 38rem"
            />
            <div className="destination-card__shade" />
            <span>01</span>
            <div>
              <p>{chapter.card.category}</p>
              <h3>{chapter.card.title}</h3>
              <small>{chapter.card.subtitle}</small>
              <span className="destination-description">
                {chapter.card.description}
              </span>
            </div>
          </article>
        </div>
        <p className="frame-rate">300 frames · 30 fps</p>
      </div>
    </section>
  );
}

const journeyChapters: ChapterData[] = [
  {
    id: "dambulla",
    number: "05",
    eyebrow: "Cultural triangle",
    title: "Dambulla",
    lede: "The road rises into the island's ancient heart — where a rock fortress pierces the morning sky.",
    frameCount: DAMBULLA_FRAME_COUNT,
    frameSource: dambullaFrameSource,
    card: {
      image: "/destinations/dambulla-sigiriya.webp",
      alt: "Sigiriya rock fortress at sunrise",
      category: "Cultural",
      title: "Sigiriya Rock Fortress",
      subtitle: "Climb at dawn · UNESCO World Heritage",
      description:
        "Ascend the ancient citadel through the lion's paws to frescoed galleries and sweeping views over the cultural triangle.",
    },
  },
  {
    id: "anuradhapura",
    number: "06",
    eyebrow: "Ancient cities",
    title: "Anuradhapura",
    lede: "Two thousand years of devotion — white stupas glowing against the dusk sky.",
    frameCount: ANURADHAPURA_FRAME_COUNT,
    frameSource: anuradhapuraFrameSource,
    card: {
      image: "/destinations/anuradhapura-stupa.webp",
      alt: "Ruwanweliseya stupa at sunset",
      category: "Spiritual",
      title: "Ruwanweliseya Stupa",
      subtitle: "Sunset rituals · Sacred city",
      description:
        "Walk the sacred precincts at dusk as lamps are lit around the great stupa, in the island's first ancient capital.",
    },
  },
  {
    id: "polonnaruwa",
    number: "07",
    eyebrow: "Ancient cities",
    title: "Polonnaruwa",
    lede: "Stone temples and silent Buddhas — the medieval capital frozen in golden light.",
    frameCount: POLONNARUWA_FRAME_COUNT,
    frameSource: polonnaruwaFrameSource,
    card: {
      image: "/destinations/polonnaruwa-ruins.webp",
      alt: "Ancient stone ruins of Polonnaruwa",
      category: "Cultural",
      title: "Polonnaruwa Ruins",
      subtitle: "Vatadage · Gal Vihara",
      description:
        "Cycle between thousand-year-old shrines, royal palaces and the serene rock-cut Buddhas of Gal Vihara.",
    },
  },
  {
    id: "trincomalee",
    number: "08",
    eyebrow: "East coast",
    title: "Trincomalee",
    lede: "The island turns east — where deep blue bays meet sacred headlands.",
    frameCount: TRINCOMALEE_FRAME_COUNT,
    frameSource: trincomaleeFrameSource,
    card: {
      image: "/destinations/trincomalee-beach.webp",
      alt: "Turquoise bay near Trincomalee",
      category: "Wildlife",
      title: "Trincomalee Coast",
      subtitle: "Snorkeling · Pigeon Island",
      description:
        "Swim over coral gardens, watch blue whales offshore in season, and climb to Koneswaram Temple above the sea.",
    },
  },
  {
    id: "kalpitiya",
    number: "09",
    eyebrow: "Northwest coast",
    title: "Kalpitiya",
    lede: "Wind, lagoon and open sea — the island's wild northwestern edge.",
    frameCount: KALPITIYA_FRAME_COUNT,
    frameSource: kalpitiyaFrameSource,
    card: {
      image: "/destinations/kalpitiya-sail.webp",
      alt: "Traditional sail boat on Kalpitiya beach",
      category: "Adventure",
      title: "Kalpitiya Lagoon",
      subtitle: "Kitesurfing · Dolphin watching",
      description:
        "Ride the wind in Asia's kitesurfing capital, then sail out at dawn to meet spinner dolphins in the open sea.",
    },
  },
  {
    id: "kandy",
    number: "10",
    eyebrow: "Hill capital",
    title: "Kandy",
    lede: "Up into the hills — the last kingdom, wrapped around its sacred lake.",
    frameCount: KANDY_FRAME_COUNT,
    frameSource: kandyFrameSource,
    card: {
      image: "/destinations/kandy-hotel.webp",
      alt: "Colonial hotel in Kandy with elephant",
      category: "Cultural",
      title: "Kandy",
      subtitle: "Temple of the Tooth · Esala Perahera",
      description:
        "Pay respects at the Temple of the Sacred Tooth Relic and feel the city's living traditions in every street.",
    },
  },
  {
    id: "matale",
    number: "11",
    eyebrow: "Central highlands",
    title: "Matale",
    lede: "Mist on still water — spice gardens and quiet valleys below the hills.",
    frameCount: MATALE_FRAME_COUNT,
    frameSource: mataleFrameSource,
    card: {
      image: "/destinations/matale-lake.webp",
      alt: "Misty lake at dawn near Matale",
      category: "Cultural",
      title: "Matale",
      subtitle: "Spice gardens · Sembuwatta Lake",
      description:
        "Wander fragrant spice gardens, then drift across mirror-still Sembuwatta Lake at first light.",
    },
  },
  {
    id: "nuwaraeliya",
    number: "12",
    eyebrow: "Tea country",
    title: "Nuwara Eliya",
    lede: "Little England in the hills — misty tea estates and the famous hill-country railway.",
    frameCount: NUWARAELIYA_FRAME_COUNT,
    frameSource: nuwaraeliyaFrameSource,
    card: {
      image: "/destinations/nuwaraeliya-train.webp",
      alt: "Blue train crossing a stone viaduct in tea country",
      category: "Adventure",
      title: "Hill-Country Railway",
      subtitle: "Train journeys · Tea estates",
      description:
        "Ride one of the world's most beautiful train journeys through emerald tea plantations and misty valleys.",
    },
  },
  {
    id: "ella",
    number: "13",
    eyebrow: "Hill country",
    title: "Ella",
    lede: "Waterfalls, viewpoints and the iconic bridge — the hills at their most dramatic.",
    frameCount: ELLA_FRAME_COUNT,
    frameSource: ellaFrameSource,
    card: {
      image: "/destinations/ella-bridge.webp",
      alt: "Nine Arch Bridge with train in misty jungle",
      category: "Adventure",
      title: "Nine Arch Bridge",
      subtitle: "Little Adam's Peak · Ravana Falls",
      description:
        "Walk the legendary Nine Arch Bridge, hike Little Adam's Peak at sunrise and chase the waterfalls of Ella.",
    },
  },
  {
    id: "badulla",
    number: "14",
    eyebrow: "Hill country",
    title: "Badulla",
    lede: "Beyond the crowds — quiet valleys, waterfalls and hidden eco retreats.",
    frameCount: BADULLA_FRAME_COUNT,
    frameSource: badullaFrameSource,
    card: {
      image: "/destinations/badulla-lodge.webp",
      alt: "Eco lodge among tea plantations near Badulla",
      category: "Adventure",
      title: "Badulla Highlands",
      subtitle: "Dunhinda Falls · Eco retreats",
      description:
        "Discover Dunhinda Falls, stay in lodges wrapped by tea gardens, and feel the unhurried rhythm of the highlands.",
    },
  },
  {
    id: "yala",
    number: "15",
    eyebrow: "Wild south",
    title: "Yala",
    lede: "Down to the wild south — leopards, elephants and untamed jungle.",
    frameCount: YALA_FRAME_COUNT,
    frameSource: yalaFrameSource,
    card: {
      image: "/destinations/yala-leopard.webp",
      alt: "Leopard on a tree branch in Yala",
      category: "Wildlife",
      title: "Yala National Park",
      subtitle: "Leopard safaris · Bundala wetlands",
      description:
        "Track leopards with expert rangers at dawn in Sri Lanka's most famous wilderness, from Tissamaharama.",
    },
  },
];

function DestinationsOverlay({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const gridCardRefs = useRef<Array<HTMLElement | null>>([]);
  const blurRef = useRef<HTMLDivElement>(null);
  const spotlightRefs = useRef<Array<HTMLElement | null>>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      animationFrameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;

      const maxScroll = section.offsetHeight - window.innerHeight;
      const fullProgress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / maxScroll),
      );
      const journeyProgress = Math.min(
        1,
        fullProgress / EXISTING_JOURNEY_END,
      );
      const progress = Math.min(
        1,
        Math.max(0, (journeyProgress - 0.417) / 0.257),
      );

      const overviewVisibility = Math.max(
        0,
        1 - Math.max(0, progress - 0.38) / 0.08,
      );
      const exitProgress = Math.max(0, progress - 0.38);
      if (headingRef.current) {
        headingRef.current.style.opacity = String(overviewVisibility);
        headingRef.current.style.transform = `translateY(${-exitProgress * 80}px)`;
      }
      if (overviewRef.current) {
        overviewRef.current.style.opacity = String(overviewVisibility);
        overviewRef.current.style.transform = `translate(-50%, calc(-50% - ${exitProgress * 80}px)) scale(${1 - exitProgress * 0.08})`;
      }

      gridCardRefs.current.forEach((card, index) => {
        if (!card) return;
        const start = index * 0.055;
        const enter = Math.min(
          1,
          Math.max(0, (progress - start) / 0.16),
        );
        card.style.opacity = String(enter);
        card.style.transform = `translateX(${(1 - enter) * (108 + index * 10)}vw) rotate(${(1 - enter) * 3}deg)`;
      });

      let backgroundBlur = 0;
      spotlightRefs.current.forEach((card, index) => {
        if (!card) return;
        const start = 0.42 + index * 0.145;
        const local = Math.min(1, Math.max(0, (progress - start) / 0.145));
        const enter = Math.min(1, local / 0.18);
        const exit = Math.min(1, (1 - local) / 0.16);
        const opacity = Math.min(enter, exit);
        const scale = 0.56 + Math.min(1, local / 0.72) * 0.44;
        backgroundBlur = Math.max(
          backgroundBlur,
          10 * Math.min(1, local / 0.68) * exit,
        );
        card.style.opacity = String(opacity);
        card.style.transform = `translateY(${(1 - enter) * 12}vh) scale(${scale})`;
        card.style.visibility = opacity <= 0 ? "hidden" : "visible";
      });

      if (blurRef.current) {
        blurRef.current.style.opacity = String(backgroundBlur / 10);
        blurRef.current.style.backdropFilter = `blur(${backgroundBlur}px)`;
      }
    };

    const requestUpdate = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("scroll", requestUpdate);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="destinations-overlay">
        <div className="destinations__heading" ref={headingRef}>
          <p>Four ways to know Negombo</p>
          <h2>Explore the coast</h2>
        </div>

        <div className="destination-grid" ref={overviewRef}>
          {destinations.map((destination, index) => (
            <article
              className="destination-card"
              key={destination.name}
              ref={(node) => {
                gridCardRefs.current[index] = node;
              }}
            >
              <Image
                src={destination.image}
                alt={destination.alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="destination-card__shade" />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{destination.category}</p>
                <h3>{destination.name}</h3>
                <small>{destination.localName}</small>
                <span className="destination-description">
                  {destination.description}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="destination-blur" ref={blurRef} />

        <div className="destination-spotlights">
          {destinations.map((destination, index) => (
            <article
              className="destination-spotlight"
              key={destination.name}
              ref={(node) => {
                spotlightRefs.current[index] = node;
              }}
            >
              <Image src={destination.image} alt="" fill sizes="100vw" />
              <div className="destination-card__shade" />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{destination.category}</p>
                <h3>{destination.name}</h3>
                <small>{destination.localName}</small>
                <span className="destination-description">
                  {destination.description}
                </span>
              </div>
            </article>
          ))}
        </div>
    </div>
  );
}

function KitulgalaActivityOverlay({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      animationFrameRef.current = null;
      const section = sectionRef.current;
      const card = cardRef.current;
      if (!section || !card) return;

      const maxScroll = section.offsetHeight - window.innerHeight;
      const fullProgress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / maxScroll),
      );
      const journeyProgress = Math.min(
        1,
        fullProgress / EXISTING_JOURNEY_END,
      );
      const progress = Math.min(
        1,
        Math.max(0, (journeyProgress - 0.87) / 0.13),
      );
      const enter = Math.min(1, progress / 0.28);
      const expand = Math.min(1, Math.max(0, (progress - 0.4) / 0.42));
      const exit = Math.min(1, (1 - progress) / 0.14);
      const opacity = Math.min(enter, exit);
      const blur = 10 * expand * exit;

      card.style.opacity = String(opacity);
      card.style.visibility = opacity <= 0 ? "hidden" : "visible";
      card.style.transform = `translateX(${(1 - enter) * 110}vw) scale(${0.58 + expand * 0.42})`;

      if (blurRef.current) {
        blurRef.current.style.opacity = String(blur / 10);
        blurRef.current.style.backdropFilter = `blur(${blur}px)`;
      }
    };

    const requestUpdate = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("scroll", requestUpdate);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sectionRef]);

  return (
    <div className="kitulgala-activity">
      <div className="kitulgala-activity__blur" ref={blurRef} />
      <article
        className="destination-spotlight kitulgala-card"
        ref={cardRef}
      >
        <Image
          src={kitulgalaFrameSource(140)}
          alt="White-water rafting through the rainforest in Kitulgala"
          fill
          sizes="100vw"
        />
        <div className="destination-card__shade" />
        <span>01</span>
        <div>
          <p>Adventure</p>
          <h3>White-water rafting</h3>
          <small>Kelani River</small>
          <span className="destination-description">
            Paddle through forest-lined rapids on one of Sri Lanka's most
            exhilarating river journeys.
          </span>
        </div>
      </article>
    </div>
  );
}

function YapahuwaActivitiesOverlay({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridCardRefs = useRef<Array<HTMLElement | null>>([]);
  const spotlightRefs = useRef<Array<HTMLElement | null>>([]);
  const blurRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      animationFrameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;

      const maxScroll = section.offsetHeight - window.innerHeight;
      const fullProgress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / maxScroll),
      );
      const progress = Math.min(
        1,
        Math.max(0, (fullProgress - 0.86) / 0.14),
      );
      const overviewVisibility = Math.max(
        0,
        1 - Math.max(0, progress - 0.35) / 0.08,
      );
      const exitProgress = Math.max(0, progress - 0.35);

      if (headingRef.current) {
        headingRef.current.style.opacity = String(overviewVisibility);
        headingRef.current.style.transform = `translateY(${-exitProgress * 80}px)`;
      }
      if (gridRef.current) {
        gridRef.current.style.opacity = String(overviewVisibility);
        gridRef.current.style.transform = `translate(-50%, calc(-50% - ${exitProgress * 80}px)) scale(${1 - exitProgress * 0.08})`;
      }

      gridCardRefs.current.forEach((card, index) => {
        if (!card) return;
        const start = index * 0.07;
        const enter = Math.min(
          1,
          Math.max(0, (progress - start) / 0.18),
        );
        card.style.opacity = String(enter);
        card.style.transform = `translateX(${(1 - enter) * (108 + index * 12)}vw) rotate(${(1 - enter) * 3}deg)`;
      });

      let backgroundBlur = 0;
      spotlightRefs.current.forEach((card, index) => {
        if (!card) return;
        const start = 0.43 + index * 0.19;
        const local = Math.min(1, Math.max(0, (progress - start) / 0.19));
        const enter = Math.min(1, local / 0.18);
        const exit = Math.min(1, (1 - local) / 0.16);
        const opacity = Math.min(enter, exit);
        const scale = 0.56 + Math.min(1, local / 0.72) * 0.44;
        backgroundBlur = Math.max(
          backgroundBlur,
          10 * Math.min(1, local / 0.68) * exit,
        );
        card.style.opacity = String(opacity);
        card.style.visibility = opacity <= 0 ? "hidden" : "visible";
        card.style.transform = `translateY(${(1 - enter) * 12}vh) scale(${scale})`;
      });

      if (blurRef.current) {
        blurRef.current.style.opacity = String(backgroundBlur / 10);
        blurRef.current.style.backdropFilter = `blur(${backgroundBlur}px)`;
      }
    };

    const requestUpdate = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("scroll", requestUpdate);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sectionRef]);

  return (
    <div className="yapahuwa-activities">
      <div className="destinations__heading" ref={headingRef}>
        <p>Three ways to experience Yapahuwa</p>
        <h2>Explore the kingdom</h2>
      </div>

      <div className="destination-grid yapahuwa-grid" ref={gridRef}>
        {yapahuwaActivities.map((activity, index) => (
          <article
            className="destination-card"
            key={activity.name}
            ref={(node) => {
              gridCardRefs.current[index] = node;
            }}
          >
            <Image
              src={activity.image}
              alt={activity.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="destination-card__shade" />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p>{activity.category}</p>
              <h3>{activity.name}</h3>
              <small>{activity.localName}</small>
              <span className="destination-description">
                {activity.description}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="destination-blur" ref={blurRef} />

      <div className="destination-spotlights">
        {yapahuwaActivities.map((activity, index) => (
          <article
            className="destination-spotlight"
            key={activity.name}
            ref={(node) => {
              spotlightRefs.current[index] = node;
            }}
          >
            <Image src={activity.image} alt="" fill sizes="100vw" />
            <div className="destination-card__shade" />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p>{activity.category}</p>
              <h3>{activity.name}</h3>
              <small>{activity.localName}</small>
              <span className="destination-description">
                {activity.description}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Preloader({ exiting }: { exiting: boolean }) {
  return (
    <div
      className={`preloader${exiting ? " preloader--exiting" : ""}`}
      aria-label="Ariva is loading"
    >
      <div className="preloader__map" aria-hidden="true">
        <Image src="/sri-lanka-map.svg" alt="" fill priority />
      </div>
      <div className="preloader__welcome">
        <span>Welcome to</span>
        <strong>Ariva</strong>
      </div>
    </div>
  );
}

export default function App() {
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);
  const [preloaderState, setPreloaderState] = useState<
    "visible" | "exiting" | "hidden"
  >("visible");

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumTimePassed(true), 3400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!firstFrameReady || !minimumTimePassed) return;
    setPreloaderState("exiting");
    const timer = window.setTimeout(() => setPreloaderState("hidden"), 900);
    return () => window.clearTimeout(timer);
  }, [firstFrameReady, minimumTimePassed]);

  useEffect(() => {
    document.body.classList.toggle("is-loading", preloaderState !== "hidden");
    return () => document.body.classList.remove("is-loading");
  }, [preloaderState]);

  const handleFirstFrameReady = useCallback(() => {
    setFirstFrameReady(true);
  }, []);

  return (
    <main>
      <JourneySequence
        isVisible={preloaderState !== "visible"}
        onFirstFrameReady={handleFirstFrameReady}
      />
      {journeyChapters.map((chapter) => (
        <JourneyChapter key={chapter.id} chapter={chapter} />
      ))}
      <section className="intro" id="discover">
        <p>Keep exploring</p>
        <h2>Every journey holds a different story.</h2>
        <span>
          Follow the coast, rivers, wildlife and living traditions that make
          every corner of Sri Lanka unforgettable.
        </span>
      </section>
      {preloaderState !== "hidden" && (
        <Preloader exiting={preloaderState === "exiting"} />
      )}
    </main>
  );
}
