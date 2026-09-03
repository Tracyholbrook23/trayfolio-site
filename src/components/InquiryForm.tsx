"use client";

import { useState, type FormEvent } from "react";

/**
 * Web3Forms access key, from https://app.web3forms.com/forms
 *
 * This is a PUBLIC key by design. It ships in the browser bundle either
 * way and only identifies which inbox submissions are delivered to, so
 * there is nothing to hide here and no env var needed.
 */
const WEB3FORMS_ACCESS_KEY = "29b9fc26-6e77-40dd-ad1b-5439a304c145";

const OWNER_EMAIL = "tracyholbrook532@gmail.com";

const projectTypes = [
  "New website",
  "Redesign",
  "E-commerce / Shopify",
  "Ongoing care & support",
  "Something else",
];

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-stone-900 disabled:bg-stone-50 disabled:text-stone-500";

export default function InquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [projectType, setProjectType] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  // Honeypot: real people never see this, so anything in it is a bot.
  const [botcheck, setBotcheck] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sending = status === "sending";

  function toggleType(type: string) {
    setProjectType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setBusiness("");
    setProjectType([]);
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New website inquiry: ${business || name || "Trayfolio lead"}`,
          from_name: "Trayfolio website",
          // Lets you hit reply in Gmail and answer the lead directly.
          replyto: email,
          botcheck,
          name,
          email,
          phone: phone || "Not given",
          business: business || "Not given",
          project_type: projectType.length ? projectType.join(", ") : "Not specified",
          message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("sent");
      } else {
        throw new Error(data.message || "The form service rejected the submission.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong sending that."
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-2xl border border-stone-200 bg-stone-50 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="font-display text-2xl font-semibold tracking-tight text-stone-900">
          Got it, thank you.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">
          Your inquiry is in my inbox. I read every one myself and usually reply
          within a business day.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 text-sm font-semibold text-terracotta underline decoration-terracotta/40 underline-offset-4 transition hover:decoration-terracotta"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="inquiry-name">
            Your name
          </label>
          <input
            id="inquiry-name"
            name="name"
            autoComplete="name"
            required
            disabled={sending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="inquiry-email">
            Email
          </label>
          <input
            id="inquiry-email"
            name="email"
            autoComplete="email"
            required
            type="email"
            disabled={sending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="jane@business.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="inquiry-phone">
            Phone{" "}
            <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            disabled={sending}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="inquiry-business">
            Business / industry
          </label>
          <input
            id="inquiry-business"
            name="business"
            disabled={sending}
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className={inputClass}
            placeholder="e.g. home services, photography..."
          />
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-stone-700">What do you need?</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {projectTypes.map((type) => (
            <button
              type="button"
              key={type}
              disabled={sending}
              onClick={() => toggleType(type)}
              aria-pressed={projectType.includes(type)}
              className={`rounded-full border px-4 py-2 text-sm transition disabled:opacity-60 ${
                projectType.includes(type)
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 text-stone-600 hover:border-stone-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700" htmlFor="inquiry-message">
          Tell me about your project
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          required
          disabled={sending}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={inputClass}
          placeholder="What does your business do, and what do you need from a website?"
        />
      </div>

      {/* Honeypot. Hidden from people and from screen readers; bots fill it in. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        checked={botcheck === "on"}
        onChange={(e) => setBotcheck(e.target.checked ? "on" : "")}
      />

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta/20 transition hover:bg-terracotta-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Sending..." : "Send inquiry"}
      </button>

      {status === "error" ? (
        <p className="text-sm leading-6 text-red-700" role="alert">
          That didn&apos;t go through: {errorMessage} You can email me directly at{" "}
          <a
            href={`mailto:${OWNER_EMAIL}`}
            className="font-semibold underline underline-offset-4"
          >
            {OWNER_EMAIL}
          </a>{" "}
          and I&apos;ll pick it up there.
        </p>
      ) : (
        <p className="text-xs text-stone-500">
          Sends straight to my inbox. No account needed, and I never share your
          details with anyone.
        </p>
      )}
    </form>
  );
}
