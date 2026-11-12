"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Pencil, X } from "lucide-react";
import {
  BRAND_CHOICES,
  DEMO_FIELDS,
  EMPTY_ANSWERS,
  GOAL_CHOICES,
  checkDemoAnswer,
  type DemoAnswerKey,
  type DemoAnswers,
  type DemoField,
} from "@/lib/demo-intake";

// The publishable key is public by design (it only lets the browser show
// Stripe's payment form), so it can live in the code. An env var overrides it.
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_live_51ThKBdK4Q3gVPNAPncTDiSOXv3OIlRHbMZJDG7muSdIoCg1lVmRtKwHimaU1kipSECr2Lk7GONwTGiNE0m4JCfQ400N6Ii6xCQ";
// Stripe.js is pinned to the same release as the API version in src/lib/stripe.ts.
const STRIPE_JS_URL = "https://js.stripe.com/dahlia/stripe.js";

type EmbeddedCheckout = { mount: (target: HTMLElement) => void; destroy: () => void };
type StripeFactory = (key: string) => {
  createEmbeddedCheckoutPage?: (options: { fetchClientSecret: () => Promise<string> }) => Promise<EmbeddedCheckout>;
  initEmbeddedCheckout?: (options: { fetchClientSecret: () => Promise<string> }) => Promise<EmbeddedCheckout>;
};

let stripeScript: Promise<StripeFactory> | null = null;

/* *************************
 * loadStripe
 * Loads Stripe.js from Stripe once and reuses it for every checkout.
 *
 * @param none
 * @exception rejects if the script cannot load
 * @return the global Stripe factory
 **************************/
function loadStripe(): Promise<StripeFactory> {
  const existing = (window as unknown as { Stripe?: StripeFactory }).Stripe;
  if (existing) return Promise.resolve(existing);
  if (!stripeScript) {
    stripeScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = STRIPE_JS_URL;
      script.async = true;
      script.onload = () => {
        const factory = (window as unknown as { Stripe?: StripeFactory }).Stripe;
        if (factory) resolve(factory);
        else reject(new Error("Stripe did not load."));
      };
      script.onerror = () => {
        stripeScript = null;
        reject(new Error("Stripe did not load."));
      };
      document.head.appendChild(script);
    });
  }
  return stripeScript;
}

type Question = {
  key: DemoAnswerKey;
  ask: (a: DemoAnswers) => string;
  hint?: string | ((a: DemoAnswers) => string);
  placeholder?: string;
  kind: "text" | "email" | "long" | "choice";
  autoComplete?: string;
};

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "";

/** One question per screen, in the order a real conversation would go. */
const QUESTIONS: Question[] = [
  { key: "name", kind: "text", ask: () => "First things first. What's your name?", placeholder: "Your name", autoComplete: "name" },
  {
    key: "email",
    kind: "email",
    ask: (a) => `Nice to meet you${firstName(a.name) ? `, ${firstName(a.name)}` : ""}! What's the best email for you?`,
    hint: "This is where your demo and order details go. I'll save your answers as you go, so you can finish later if you get pulled away.",
    placeholder: "you@yourbusiness.com",
    autoComplete: "email",
  },
  { key: "business", kind: "text", ask: () => "What's your business called?", placeholder: "Business name", autoComplete: "organization" },
  { key: "about", kind: "text", ask: (a) => `What does ${a.business || "your business"} do?`, placeholder: "Mobile car detailing" },
  {
    key: "location",
    kind: "text",
    ask: () => "Where are you based, and who are your customers?",
    hint: "This helps the demo speak to the right people.",
    placeholder: "Round Rock, TX. Busy families and car lovers",
  },
  { key: "goal", kind: "choice", ask: () => "What's the #1 thing you want your website to do?" },
  {
    key: "details",
    kind: "long",
    ask: () => "What should your demo show?",
    hint: "Services, prices, photos, reviews. Whatever you'd want a new customer to see first.",
    placeholder: "My three detailing packages with prices, before and after photos, and a big Book Now button.",
  },
  {
    key: "website",
    kind: "text",
    ask: () => "Got a current website or Instagram?",
    hint: "I'll use it to get a feel for your brand. Skip it if you don't have one.",
    placeholder: "instagram.com/yourbusiness",
  },
  {
    key: "brand",
    kind: "choice",
    ask: () => "Do you have a logo or brand colors?",
    hint: "If you do, you'll just reply to your confirmation email with them after you order.",
  },
  {
    key: "style",
    kind: "text",
    ask: () => "Any websites or styles you love?",
    hint: "Colors, vibes, or a site you wish was yours. Optional.",
    placeholder: "Clean and modern, dark colors, like apple.com",
  },
];

const CHOICES: Partial<Record<DemoAnswerKey, readonly string[]>> = { goal: GOAL_CHOICES, brand: BRAND_CHOICES };
const FIELD_BY_KEY = Object.fromEntries(DEMO_FIELDS.map((field) => [field.key, field])) as Record<DemoAnswerKey, DemoField>;
const STORAGE_KEY = "trayfolio-demo-lead";

/** Labels on the review screen, written to the visitor (emails to Tracy use the field labels). */
const REVIEW_LABELS: Record<DemoAnswerKey, string> = {
  name: "Your name",
  email: "Your email",
  business: "Business",
  about: "What you do",
  location: "Where and who you serve",
  goal: "Main goal",
  details: "Your demo should show",
  website: "Current site or social",
  brand: "Logo and colors",
  style: "Styles you like",
};

/** Only one button on the page should react to a ?resume= link. */
let resumeOwner: symbol | null = null;

/** A little encouragement under the progress bar as it fills. */
function cheer(done: number, total: number): string {
  const ratio = done / total;
  if (ratio === 0) return "Takes about two minutes";
  if (ratio < 0.4) return "Great start";
  if (ratio < 0.7) return "Halfway there";
  if (ratio < 1) return "Almost done";
  return "All set";
}

function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string | null) {
  try {
    if (token) window.localStorage.setItem(STORAGE_KEY, token);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Private browsing: progress just won't survive a reload. */
  }
}

/** The first question still missing a valid answer, or -1 when all are done. */
function firstUnanswered(answers: DemoAnswers): number {
  return QUESTIONS.findIndex((q) => checkDemoAnswer(FIELD_BY_KEY[q.key], answers[q.key]) !== "");
}

/* *************************
 * DemoCheckoutButton
 * Opens a one-question-at-a-time intake so the buyer tells Tracy about their
 * business, shows them a review of their answers and exactly what they get,
 * then shows Stripe's payment form in the same dialog. Answers are saved as
 * soon as there's an email, so an unfinished form can get a reminder email
 * and be picked back up from its link. If the embedded payment form can't
 * load, it falls back to Stripe's hosted page.
 *
 * @param className : extra classes for the wrapper
 * @exception none
 * @return the order button, its intake dialog, and the terms note
 **************************/
export default function DemoCheckoutButton({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const checkoutRef = useRef<EmbeddedCheckout | null>(null);
  const tokenRef = useRef<string | null>(null);
  const idRef = useRef(Symbol("demo-button"));
  const [editing, setEditing] = useState(false);
  const [stage, setStage] = useState<"questions" | "review" | "payment">("questions");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DemoAnswers>(EMPTY_ANSWERS);
  const [botcheck, setBotcheck] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const field = FIELD_BY_KEY[question.key];
  const value = answers[question.key];
  const done = stage === "questions" ? index : total;

  // Refill a form the visitor started earlier: from a reminder email's
  // ?resume= link (and open it), or quietly from this browser's last visit.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resume = params.get("resume");
    const fromLink = Boolean(resume) && (resumeOwner === null || resumeOwner === idRef.current);
    if (fromLink) resumeOwner = idRef.current;
    const token = fromLink ? resume : readStoredToken();
    if (!token) return;

    let cancelled = false;
    fetch(`/api/demo-lead?token=${encodeURIComponent(token)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { answers?: DemoAnswers; paid?: boolean } | null) => {
        if (cancelled) return;
        if (!data?.answers || data.paid) {
          storeToken(null);
          return;
        }
        tokenRef.current = token;
        storeToken(token);
        setAnswers({ ...EMPTY_ANSWERS, ...data.answers });
        const next = firstUnanswered({ ...EMPTY_ANSWERS, ...data.answers });
        if (next === -1) setStage("review");
        else setIndex(next);
        if (fromLink) {
          params.delete("resume");
          const query = params.toString();
          window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
          dialogRef.current?.showModal();
        }
      })
      .catch(() => { /* Starting fresh is fine. */ });
    return () => { cancelled = true; };
  }, []);

  // Put the cursor in the answer box every time a new question shows up.
  useEffect(() => {
    if (stage === "questions") fieldRef.current?.focus();
  }, [index, stage]);

  function open() {
    setError("");
    dialogRef.current?.showModal();
    requestAnimationFrame(() => fieldRef.current?.focus());
  }

  function clearPayment() {
    checkoutRef.current?.destroy();
    checkoutRef.current = null;
    if (stage === "payment") setStage("review");
  }

  function close() {
    if (submitting) return;
    clearPayment();
    dialogRef.current?.close();
  }

  /** Saves progress once there's an email. Never blocks or bothers the visitor. */
  function save(next: DemoAnswers, step: string) {
    if (!next.email.trim()) return;
    fetch("/api/demo-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenRef.current, answers: next, step, botcheck }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { token?: string | null } | null) => {
        if (data?.token) {
          tokenRef.current = data.token;
          storeToken(data.token);
        }
      })
      .catch(() => { /* Progress just isn't saved this time. */ });
  }

  function goTo(nextIndex: number, fromReview = false) {
    setError("");
    setEditing(fromReview);
    setStage("questions");
    setIndex(nextIndex);
  }

  function advance(nextAnswers: DemoAnswers) {
    setError("");
    // Changing one answer from the review screen goes straight back to it.
    if ((editing && firstUnanswered(nextAnswers) === -1) || index === total - 1) {
      setEditing(false);
      setStage("review");
      save(nextAnswers, "review");
      return;
    }
    const next = index + 1;
    setIndex(next);
    save(nextAnswers, QUESTIONS[next].key);
  }

  function choose(choice: string) {
    const next = { ...answers, [question.key]: choice };
    setAnswers(next);
    // A short pause so the tap registers visually before moving on.
    window.setTimeout(() => advance(next), 220);
  }

  function back() {
    setError("");
    if (stage === "review") {
      setStage("questions");
      setIndex(total - 1);
    } else {
      setIndex((i) => Math.max(0, i - 1));
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // In the long answer, Enter makes a new line; Cmd/Ctrl + Enter moves on.
    if (event.key === "Enter" && question.kind === "long" && !(event.metaKey || event.ctrlKey)) return;
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = checkDemoAnswer(field, value);
    if (problem) {
      setError(problem);
      return;
    }
    advance(answers);
  }

  async function requestCheckout(body: object, embedded: boolean) {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, embedded }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not start checkout.");
    return data as { url?: string; clientSecret?: string };
  }

  async function payOnSite(body: object, key: string) {
    const [Stripe, data] = await Promise.all([loadStripe(), requestCheckout(body, true)]);
    const stripe = Stripe(key);
    const create = stripe.createEmbeddedCheckoutPage ?? stripe.initEmbeddedCheckout;
    if (!data.clientSecret || !create || !paymentRef.current) throw new Error("Embedded checkout unavailable.");
    const secret = data.clientSecret;
    const checkout = await create.call(stripe, { fetchClientSecret: () => Promise.resolve(secret) });
    checkoutRef.current = checkout;
    setStage("payment");
    checkout.mount(paymentRef.current);
  }

  async function pay() {
    if (submitting) return;
    const missing = firstUnanswered(answers);
    if (missing !== -1) {
      goTo(missing);
      setError(checkDemoAnswer(FIELD_BY_KEY[QUESTIONS[missing].key], answers[QUESTIONS[missing].key]) || "This one's needed to build your demo.");
      return;
    }
    const trimmed = Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, v.trim()])) as DemoAnswers;
    const body = { kind: "demo", intake: trimmed, botcheck, leadToken: tokenRef.current };
    save(trimmed, "checkout");
    setSubmitting(true);
    setError("");

    if (PUBLISHABLE_KEY) {
      try {
        await payOnSite(body, PUBLISHABLE_KEY);
        setSubmitting(false);
        return;
      } catch (err) {
        // Fall through to Stripe's hosted page so the sale is never lost.
        console.error("Embedded checkout failed, using hosted checkout", err);
        checkoutRef.current?.destroy();
        checkoutRef.current = null;
      }
    }

    try {
      const data = await requestCheckout(body, false);
      if (!data.url) throw new Error("Could not start checkout.");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const fieldClass = "w-full border-0 border-b-2 border-stone-300 bg-transparent px-0 py-3 text-xl text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-terracotta focus-visible:outline-none sm:text-2xl";
  const nextLabel = field.optional && !value.trim() ? "Skip" : editing ? "Save" : index === total - 1 ? "Review my order" : "Next";
  const hint = typeof question.hint === "function" ? question.hint(answers) : question.hint;
  const choices = CHOICES[question.key];
  const percent = Math.max(4, (done / total) * 100);
  const reviewRows = QUESTIONS.map((q, i) => ({ i, label: REVIEW_LABELS[q.key], value: answers[q.key].trim() })).filter((row) => row.value);
  const business = answers.business.trim() || "your business";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={open}
        className="rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light"
      >
        Get a $50 demo
      </button>
      <p className="mt-3 max-w-60 text-xs leading-5 text-stone-600">Non-refundable; credited toward a build. Read the <a href="/terms" className="underline underline-offset-4">terms</a> and <a href="/privacy" className="underline underline-offset-4">privacy policy</a>.</p>

      <dialog
        ref={dialogRef}
        aria-labelledby="demo-intake-title"
        onCancel={(event) => { if (submitting) event.preventDefault(); }}
        onClick={(event) => { if (event.target === dialogRef.current) close(); }}
        className="m-auto max-h-[92svh] w-[min(100%-1.5rem,36rem)] overflow-y-auto rounded-3xl bg-[#fffdf9] p-0 text-stone-900 shadow-2xl backdrop:bg-stone-950/60 backdrop:backdrop-blur-sm"
      >
        <style>{`
          .demo-q { animation: demo-q-in .4s cubic-bezier(.2,.7,.2,1); }
          @keyframes demo-q-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
          .demo-bar-fill { transition: width .6s cubic-bezier(.34,1.56,.64,1); background: linear-gradient(90deg, #b5541f, #c9a227, #b5541f); background-size: 200% 100%; animation: demo-shimmer 3s linear infinite; }
          @keyframes demo-shimmer { from { background-position: 0% 0; } to { background-position: 200% 0; } }
          .demo-bar-dot { transition: left .6s cubic-bezier(.34,1.56,.64,1); }
          @media (prefers-reduced-motion: reduce) { .demo-q, .demo-bar-fill { animation: none; } .demo-bar-fill, .demo-bar-dot { transition: none; } }
        `}</style>

        <div className="px-6 pt-6 sm:px-8 sm:pt-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-terracotta">
              {stage === "questions" ? `Question ${index + 1} of ${total}` : stage === "review" ? "Review your order" : "Payment"}
            </p>
            <button type="button" onClick={close} aria-label="Close" className="-mr-2 rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="relative mt-3 h-2.5 rounded-full bg-stone-200" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
            <div className="demo-bar-fill h-full rounded-full" style={{ width: `${percent}%` }} />
            <span
              aria-hidden="true"
              className="demo-bar-dot absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-terracotta text-[11px] shadow-md"
              style={{ left: `${percent}%` }}
            >
              {done === total ? "🎉" : ""}
            </span>
          </div>
          <p className="mt-2 text-xs font-semibold text-stone-500">{cheer(done, total)}</p>
        </div>

        {/* Questions, one at a time. */}
        <form onSubmit={next} noValidate className={stage === "questions" ? "px-6 pb-6 pt-6 sm:px-8 sm:pb-8" : "hidden"}>
          <div key={question.key} className="demo-q min-h-[14rem]">
            <h2 id="demo-intake-title" className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
              <label htmlFor={choices ? undefined : "demo-answer"}>{question.ask(answers)}</label>
            </h2>
            {hint && <p className="mt-2 leading-7 text-stone-500">{hint}</p>}

            {choices ? (
              <div role="radiogroup" aria-labelledby="demo-intake-title" className="mt-6 grid gap-2.5">
                {choices.map((choice) => {
                  const picked = value === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      role="radio"
                      aria-checked={picked}
                      onClick={() => choose(choice)}
                      className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-semibold transition ${picked ? "border-terracotta bg-terracotta/10 text-stone-900" : "border-stone-200 bg-white text-stone-700 hover:border-terracotta/60"}`}
                    >
                      {choice}
                      {picked && <Check size={18} aria-hidden="true" className="shrink-0 text-terracotta" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6">
                {question.kind === "long" ? (
                  <textarea
                    id="demo-answer"
                    ref={fieldRef}
                    rows={3}
                    maxLength={field.max}
                    value={value}
                    placeholder={question.placeholder}
                    onChange={(e) => setAnswers((a) => ({ ...a, [question.key]: e.target.value }))}
                    onKeyDown={onKeyDown}
                    className={`${fieldClass} resize-none`}
                  />
                ) : (
                  <input
                    id="demo-answer"
                    ref={fieldRef}
                    type={question.kind === "email" ? "email" : "text"}
                    inputMode={question.kind === "email" ? "email" : undefined}
                    maxLength={field.max}
                    autoComplete={question.autoComplete ?? "off"}
                    value={value}
                    placeholder={question.placeholder}
                    onChange={(e) => setAnswers((a) => ({ ...a, [question.key]: e.target.value }))}
                    onKeyDown={onKeyDown}
                    className={fieldClass}
                  />
                )}
              </div>
            )}

            {error ? (
              <p className="mt-3 text-sm font-medium text-red-700" role="alert">{error}</p>
            ) : (
              !choices && (
                <p className="mt-3 hidden text-xs text-stone-400 sm:block">
                  {question.kind === "long" ? "Press Cmd + Enter to continue" : "Press Enter to continue"}
                </p>
              )
            )}
          </div>

          <input name="botcheck" value={botcheck} onChange={(e) => setBotcheck(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <div className="mt-6 flex items-center justify-between gap-3">
            {index > 0 ? (
              <button type="button" onClick={back} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900">
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
            ) : <span />}
            {(!choices || value) && (
              <button
                type="submit"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light sm:px-7"
              >
                {nextLabel} <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </form>

        {/* Review: their answers, what they get, and what happens after paying. */}
        <div className={stage === "review" ? "demo-q px-6 pb-6 pt-6 sm:px-8 sm:pb-8" : "hidden"}>
          <h2 className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">Here&apos;s your demo order</h2>
          <p className="mt-2 leading-7 text-stone-600">Take a quick look. Tap anything to change it.</p>

          <ul className="mt-5 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
            {reviewRows.map((row) => (
              <li key={row.label}><button type="button" onClick={() => goTo(row.i, true)} className="group flex w-full items-start justify-between gap-4 px-4 py-2.5 text-left transition hover:bg-stone-50">
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500">{row.label}</span>
                  <span className="mt-0.5 block break-words text-stone-900">{row.value}</span>
                </span>
                <Pencil size={15} aria-hidden="true" className="mt-1 shrink-0 text-stone-400 transition group-hover:text-terracotta" />
              </button></li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-[#fbf3ea] p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-terracotta">What you get for $50</p>
            <ul className="mt-3 space-y-2 text-stone-800">
              {[
                `A custom one-page website demo built around ${business}, not a template`,
                "A live link you can open on your phone and share with anyone",
                "The $50 comes off the price if you go on to get a full website",
              ].map((item) => (
                <li key={item} className="flex gap-2.5"><Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-terracotta" /><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-wider text-stone-500">What happens next</p>
            <ol className="mt-3 space-y-3">
              {[
                ["Right after you pay", "A confirmation email with your order reference."],
                ["Within 1 business day", `Tracy emails you personally to confirm the details${answers.brand && answers.brand !== "Not yet, surprise me" ? " and get your logo and colors" : ""}.`],
                ["Within 48 hours", "Your demo link lands in your inbox."],
              ].map(([when, what], i) => (
                <li key={when} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-terracotta text-xs font-semibold text-white">{i + 1}</span>
                  <p className="leading-7 text-stone-700"><span className="font-semibold text-stone-900">{when}:</span> {what}</p>
                </li>
              ))}
            </ol>
          </div>

          {error && <p className="mt-4 text-sm font-medium text-red-700" role="alert">{error}</p>}

          <div className="mt-7 flex items-center justify-between gap-3">
            <button type="button" onClick={back} disabled={submitting} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-50">
              <ArrowLeft size={16} aria-hidden="true" /> Back
            </button>
            <button
              type="button"
              onClick={pay}
              disabled={submitting}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light disabled:cursor-not-allowed disabled:opacity-70 sm:px-7"
            >
              {submitting ? "Opening payment..." : "Continue to payment"} {!submitting && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
          <p className="mt-4 text-xs leading-5 text-stone-500">
            $50, non-refundable, and credited toward a full website for 90 days. See the <a href="/terms" className="underline underline-offset-4">terms</a>.
          </p>
        </div>

        {/* Payment, embedded right here. */}
        <div className={stage === "payment" ? "px-4 pb-4 pt-4 sm:px-6 sm:pb-6" : "hidden"}>
          <button type="button" onClick={clearPayment} className="mb-3 ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 transition hover:text-stone-900">
            <ArrowLeft size={16} aria-hidden="true" /> Back to my order
          </button>
          <div ref={paymentRef} className="min-h-[24rem] rounded-2xl bg-white" />
        </div>
      </dialog>
    </div>
  );
}
