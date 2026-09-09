"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ENABLED = !!ID && /^G-[A-Z0-9]+$/.test(ID);
const KEY = "trayfolio-analytics-consent-v1";
const CHANGE = "trayfolio-consent-change";
const SETTINGS = "trayfolio-consent-settings";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
type Choice = "accepted" | "rejected" | null;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean;
};

function readChoice(): Choice {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    return value && Date.now() < value.expires &&
      (value.choice === "accepted" || value.choice === "rejected") ? value.choice : null;
  } catch { return null; }
}
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE, callback);
    window.removeEventListener("storage", callback);
  };
}
const serverChoice = (): Choice => null;

function clearAnalyticsCookies() {
  const host = location.hostname.split(".");
  const domains = ["", ...host.map((_, i) => `; domain=${host.slice(i).join(".")}`)];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
    }
  }
}

export function CookieSettingsButton() {
  if (!ENABLED) return null;
  return <button type="button" className="mt-4 text-sm text-stone-700 underline underline-offset-4" onClick={() => window.dispatchEvent(new Event(SETTINGS))}>Cookie settings</button>;
}

export default function GoogleAnalytics() {
  const savedChoice = useSyncExternalStore(subscribe, readChoice, serverChoice);
  const [sessionChoice, setSessionChoice] = useState<Choice>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const choice = sessionChoice ?? savedChoice;

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    const sync = () => setSessionChoice(null);
    window.addEventListener(SETTINGS, open);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SETTINGS, open);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!ENABLED || !ID) return;
    const win = window as unknown as AnalyticsWindow;
    win[`ga-disable-${ID}`] = choice !== "accepted";
    if (choice !== "accepted") {
      clearAnalyticsCookies();
      return;
    }
    win.dataLayer ??= [];
    // Google’s command queue uses Arguments objects, not ordinary arrays.
    // eslint-disable-next-line prefer-rest-params
    win.gtag ??= function () { win.dataLayer!.push(arguments); };
    win.gtag("js", new Date());
    win.gtag("config", ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_flags: "SameSite=Lax;Secure",
    });
    // Exclude payment return pages and URL queries (which can contain session IDs).
    if (!pathname.startsWith("/start/")) {
      win.gtag("event", "page_view", {
        page_location: `${location.origin}${pathname}`,
        page_title: document.title,
        page_referrer: document.referrer ? new URL(document.referrer).origin : "",
      });
    }
  }, [choice, pathname]);

  function choose(next: Exclude<Choice, null>) {
    if (ID) (window as unknown as AnalyticsWindow)[`ga-disable-${ID}`] = next !== "accepted";
    if (next === "rejected") clearAnalyticsCookies();
    try { localStorage.setItem(KEY, JSON.stringify({ choice: next, expires: Date.now() + MAX_AGE })); } catch { /* This visit still honors the choice when storage is blocked. */ }
    setSessionChoice(next);
    setSettingsOpen(false);
    window.dispatchEvent(new Event(CHANGE));
  }

  if (!ENABLED) return null;
  return <>
    {choice === "accepted" && <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />}
    {(choice === null || settingsOpen) && (
      <section aria-label="Cookie preferences" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-h-[70vh] max-w-xl overflow-y-auto rounded-2xl border border-stone-300 bg-white p-5 text-stone-900 shadow-xl sm:p-6" data-lenis-prevent>
        <h2 className="text-lg font-semibold">Your privacy choices</h2>
        <p className="mt-2 text-sm leading-6">With your permission, Google Analytics helps me understand how people use this site. You can reject analytics and still use everything. Your choice is saved for six months.</p>
        <Link href="/privacy" className="mt-2 inline-block text-sm underline underline-offset-4">Read the privacy policy</Link>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => choose("rejected")} className="min-h-11 flex-1 rounded-full border border-stone-700 px-5 py-2 text-sm font-semibold hover:bg-stone-100">Reject analytics</button>
          <button type="button" onClick={() => choose("accepted")} className="min-h-11 flex-1 rounded-full border border-stone-700 px-5 py-2 text-sm font-semibold hover:bg-stone-100">Accept analytics</button>
          {settingsOpen && choice !== null && <button type="button" className="px-3 py-2 text-sm underline" onClick={() => setSettingsOpen(false)}>Close</button>}
        </div>
      </section>
    )}
  </>;
}
