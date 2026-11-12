"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

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

type Answers = {
  name: string;
  business: string;
  about: string;
  goals: string;
  website: string;
  style: string;
  email: string;
};

type Question = {
  key: keyof Answers;
  ask: (a: Answers) => string;
  hint?: string;
  placeholder: string;
  max: number;
  optional?: boolean;
  multiline?: boolean;
  type?: "email";
  autoComplete?: string;
};

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "";

/** One question per screen, in the order a conversation would go. */
const QUESTIONS: Question[] = [
  { key: "name", ask: () => "First things first. What's your name?", placeholder: "Your name", max: 100, autoComplete: "name" },
  { key: "business", ask: (a) => `Nice to meet you${firstName(a.name) ? `, ${firstName(a.name)}` : ""}! What's your business called?`, placeholder: "Business name", max: 150, autoComplete: "organization" },
  { key: "about", ask: (a) => `What does ${a.business || "your business"} do?`, placeholder: "Mobile car detailing in Austin", max: 300 },
  { key: "goals", ask: () => "What do you want your demo to show?", hint: "Think about what you want visitors to see and do.", placeholder: "Show off my before and after photos, list my packages, and get people to book.", max: 500, multiline: true },
  { key: "website", ask: () => "Got a current website or Instagram?", hint: "No worries if you don't. Just skip it.", placeholder: "instagram.com/yourbusiness", max: 200, optional: true },
  { key: "style", ask: () => "Any websites or styles you love?", hint: "Colors, vibes, or a site you wish was yours.", placeholder: "Clean and modern, dark colors, like apple.com", max: 300, optional: true },
  { key: "email", ask: () => "Last one. Where should I send your demo?", placeholder: "you@yourbusiness.com", max: 254, type: "email", autoComplete: "email" },
];

const EMPTY: Answers = { name: "", business: "", about: "", goals: "", website: "", style: "", email: "" };

/** A little encouragement under the progress bar as it fills. */
function cheer(done: number, total: number): string {
  const ratio = done / total;
  if (ratio === 0) return "Takes about a minute";
  if (ratio < 0.4) return "Great start";
  if (ratio < 0.7) return "Halfway there";
  if (ratio < 1) return "Almost done";
  return "All set";
}

/* *************************
 * DemoCheckoutButton
 * Opens a short, one-question-at-a-time intake so the buyer tells Tracy about
 * their business and what they want on the demo, then shows Stripe's payment
 * form in the same dialog. If the embedded form can't load, it falls back to
 * Stripe's hosted page. The answers travel with the checkout session and land
 * in Tracy's order email.
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
  const [step, setStep] = useState<"details" | "payment">("details");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [botcheck, setBotcheck] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const value = answers[question.key];
  const isLast = index === total - 1;
  const done = step === "payment" ? total : index;

  // Put the cursor in the answer box every time a new question shows up.
  useEffect(() => {
    if (step === "details") fieldRef.current?.focus();
  }, [index, step]);

  function open() {
    setError("");
    dialogRef.current?.showModal();
    requestAnimationFrame(() => fieldRef.current?.focus());
  }

  function clearPayment() {
    checkoutRef.current?.destroy();
    checkoutRef.current = null;
    setStep("details");
  }

  function close() {
    if (submitting) return;
    clearPayment();
    dialogRef.current?.close();
  }

  function check(q: Question, v: string): string {
    const trimmed = v.trim();
    if (!q.optional && !trimmed) return "This one's needed to build your demo.";
    if (trimmed.length > q.max) return `Keep it under ${q.max} characters.`;
    if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "That email doesn't look quite right.";
    return "";
  }

  function back() {
    setError("");
    setIndex((i) => Math.max(0, i - 1));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // In the long answer, Enter makes a new line; Cmd/Ctrl + Enter moves on.
    if (event.key === "Enter" && question.multiline && !(event.metaKey || event.ctrlKey)) return;
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
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
    setStep("payment");
    checkout.mount(paymentRef.current);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const problem = check(question, value);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }

    const trimmed = Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, v.trim()])) as Answers;
    const body = { kind: "demo", intake: trimmed, botcheck };
    setSubmitting(true);

    if (PUBLISHABLE_KEY) {
      try {
        await payOnSite(body, PUBLISHABLE_KEY);
        setSubmitting(false);
        return;
      } catch (err) {
        // Fall through to Stripe's hosted page so the sale is never lost.
        console.error("Embedded checkout failed, using hosted checkout", err);
        clearPayment();
      }
    }

    try {
      const data = await requestCheckout(body, false);
      if (!data.url) throw new Error("Could not start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const fieldClass = "w-full border-0 border-b-2 border-stone-300 bg-transparent px-0 py-3 text-xl text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-terracotta sm:text-2xl";
  const nextLabel = isLast ? (submitting ? "Opening checkout..." : "Continue to payment") : question.optional && !value.trim() ? "Skip" : "Next";

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
        aria-labelledby="demo-intake-question"
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
              {step === "payment" ? "Payment" : `Question ${index + 1} of ${total}`}
            </p>
            <button type="button" onClick={close} aria-label="Close" className="-mr-2 rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="relative mt-3 h-2.5 rounded-full bg-stone-200" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
            <div className="demo-bar-fill h-full rounded-full" style={{ width: `${Math.max(4, (done / total) * 100)}%` }} />
            <span
              aria-hidden="true"
              className="demo-bar-dot absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-terracotta text-[11px] shadow-md"
              style={{ left: `${Math.max(4, (done / total) * 100)}%` }}
            >
              {done === total ? "🎉" : ""}
            </span>
          </div>
          <p className="mt-2 text-xs font-semibold text-stone-500">{cheer(done, total)}</p>
        </div>

        <form onSubmit={submit} noValidate className={step === "details" ? "px-6 pb-6 pt-6 sm:px-8 sm:pb-8" : "hidden"}>
          <div key={question.key} className="demo-q min-h-[13rem]">
            <label htmlFor="demo-answer" id="demo-intake-question" className="font-display block text-2xl leading-tight tracking-tight sm:text-3xl">
              {question.ask(answers)}
            </label>
            {question.hint && <p className="mt-2 text-stone-500">{question.hint}</p>}
            <div className="mt-6">
              {question.multiline ? (
                <textarea
                  id="demo-answer"
                  ref={fieldRef}
                  rows={3}
                  maxLength={question.max}
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
                  type={question.type ?? "text"}
                  maxLength={question.max}
                  autoComplete={question.autoComplete ?? "off"}
                  value={value}
                  placeholder={question.placeholder}
                  onChange={(e) => setAnswers((a) => ({ ...a, [question.key]: e.target.value }))}
                  onKeyDown={onKeyDown}
                  className={fieldClass}
                />
              )}
            </div>
            {error ? (
              <p className="mt-3 text-sm font-medium text-red-700" role="alert">{error}</p>
            ) : (
              <p className="mt-3 hidden text-xs text-stone-400 sm:block">
                {question.multiline ? "Press Cmd + Enter to continue" : "Press Enter to continue"}
              </p>
            )}
          </div>

          <input name="botcheck" value={botcheck} onChange={(e) => setBotcheck(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <div className="mt-6 flex items-center justify-between gap-3">
            {index > 0 ? (
              <button type="button" onClick={back} disabled={submitting} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-50">
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
            ) : <span />}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-white sm:px-7 shadow-sm transition hover:bg-terracotta-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {nextLabel} {!submitting && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
          {isLast && <p className="mt-4 text-right text-xs text-stone-500">Next, you&apos;ll pay $50 to order your demo.</p>}
        </form>

        <div className={step === "payment" ? "px-4 pb-4 pt-4 sm:px-6 sm:pb-6" : "hidden"}>
          <button type="button" onClick={clearPayment} className="mb-3 ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 transition hover:text-stone-900">
            <ArrowLeft size={16} aria-hidden="true" /> Edit answers
          </button>
          <div ref={paymentRef} className="min-h-[24rem] rounded-2xl bg-white" />
        </div>
      </dialog>
    </div>
  );
}
