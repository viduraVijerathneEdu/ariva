"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // from USD
}

const COUNTRY_CURRENCY: Record<string, Currency> = {
  LK: { code: "LKR", symbol: "Rs ", rate: 301 },
  US: { code: "USD", symbol: "$", rate: 1 },
  GB: { code: "GBP", symbol: "£", rate: 0.79 },
  DE: { code: "EUR", symbol: "€", rate: 0.92 },
  FR: { code: "EUR", symbol: "€", rate: 0.92 },
  IT: { code: "EUR", symbol: "€", rate: 0.92 },
  ES: { code: "EUR", symbol: "€", rate: 0.92 },
  NL: { code: "EUR", symbol: "€", rate: 0.92 },
  IE: { code: "EUR", symbol: "€", rate: 0.92 },
  AU: { code: "AUD", symbol: "A$", rate: 1.52 },
  CA: { code: "CAD", symbol: "C$", rate: 1.36 },
  NZ: { code: "NZD", symbol: "NZ$", rate: 1.64 },
  CH: { code: "CHF", symbol: "CHF ", rate: 0.9 },
  IN: { code: "INR", symbol: "₹", rate: 83.2 },
  CN: { code: "CNY", symbol: "¥", rate: 7.24 },
  JP: { code: "JPY", symbol: "¥", rate: 149 },
  KR: { code: "KRW", symbol: "₩", rate: 1330 },
  SG: { code: "SGD", symbol: "S$", rate: 1.34 },
  AE: { code: "AED", symbol: "AED ", rate: 3.67 },
  SA: { code: "SAR", symbol: "SAR ", rate: 3.75 },
  RU: { code: "RUB", symbol: "₽", rate: 92 },
  SE: { code: "SEK", symbol: "kr ", rate: 10.4 },
  NO: { code: "NOK", symbol: "kr ", rate: 10.7 },
  DK: { code: "DKK", symbol: "kr ", rate: 6.86 },
  PL: { code: "PLN", symbol: "zł ", rate: 3.98 },
  MY: { code: "MYR", symbol: "RM ", rate: 4.47 },
  TH: { code: "THB", symbol: "฿", rate: 34.5 },
  ID: { code: "IDR", symbol: "Rp ", rate: 15600 },
};

const DEFAULT_CURRENCY: Currency = { code: "USD", symbol: "$", rate: 1 };

const COUNTRY_LANGUAGE: Record<string, string> = {
  DE: "Deutsch",
  AT: "Deutsch",
  FR: "Français",
  BE: "Français",
  IT: "Italiano",
  ES: "Español",
  NL: "Nederlands",
  CN: "中文",
  TW: "中文",
  RU: "Русский",
  JP: "日本語",
  KR: "한국어",
  LK: "Sinhala",
  IN: "Hindi",
  PT: "Português",
  BR: "Português",
  PL: "Polski",
  SE: "Svenska",
  SA: "العربية",
  AE: "العربية",
};

interface SiteState {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  allCurrencies: Currency[];
  country: string | null;
  countryName: string | null;
  formatUSD: (usd: number) => string;
  preferredLang: string | null;
  setPreferredLang: (lang: string | null) => void;
}

const SiteContext = createContext<SiteState | null>(null);

export function useSite(): SiteState {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [country, setCountry] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [preferredLang, setPreferredLangState] = useState<string | null>(null);
  const detected = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ariva-lang");
      if (saved) setPreferredLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (detected.current) return;
    detected.current = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6000);
    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.country_code) return;
        const code: string = data.country_code;
        setCountry(code);
        setCountryName(data.country_name ?? null);
        const cur = COUNTRY_CURRENCY[code];
        if (cur) setCurrency(cur);
      })
      .catch(() => {
        /* stay on USD */
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  const setCurrencyCode = useCallback((code: string) => {
    const found = Object.values(COUNTRY_CURRENCY).find((c) => c.code === code);
    if (found) setCurrency(found);
  }, []);

  const setPreferredLang = useCallback((lang: string | null) => {
    setPreferredLangState(lang);
    try {
      if (lang) localStorage.setItem("ariva-lang", lang);
      else localStorage.removeItem("ariva-lang");
    } catch {
      /* ignore */
    }
  }, []);

  const formatUSD = useCallback(
    (usd: number) => {
      const converted = usd * currency.rate;
      const rounded =
        currency.rate > 100 ? Math.round(converted / 100) * 100 : Math.round(converted);
      try {
        return (
          currency.symbol +
          new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(rounded)
        );
      } catch {
        return `${currency.symbol}${rounded}`;
      }
    },
    [currency]
  );

  const allCurrencies = Object.values(COUNTRY_CURRENCY).filter(
    (c, i, arr) => arr.findIndex((x) => x.code === c.code) === i
  );

  return (
    <SiteContext.Provider
      value={{
        currency,
        setCurrencyCode,
        allCurrencies,
        country,
        countryName,
        formatUSD,
        preferredLang,
        setPreferredLang,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

/** Dismissible geo-based language suggestion. Suggests — never auto-switches. */
export function LanguageSuggest() {
  const { country, countryName, preferredLang, setPreferredLang } = useSite();
  const [dismissed, setDismissed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("ariva-lang-suggest-dismissed") === "1") setDismissed(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (!country || dismissed || preferredLang || confirmed) return null;
  const lang = COUNTRY_LANGUAGE[country];
  if (!lang) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("ariva-lang-suggest-dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  if (confirmed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <div className="animate-fade-up rounded-2xl border border-white/10 bg-ink/95 p-4 text-cream shadow-2xl backdrop-blur">
        <p className="text-sm">
          Visiting from {countryName ?? "abroad"}? Our team can assist you in{" "}
          <strong className="text-goldlight">{lang}</strong> — just say the word when we call.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              setPreferredLang(lang);
              setConfirmed(true);
            }}
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-goldlight"
          >
            Yes, in {lang}
          </button>
          <button
            onClick={dismiss}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-cream/80 transition hover:border-white/40 hover:text-cream"
          >
            Keep English
          </button>
        </div>
      </div>
    </div>
  );
}
