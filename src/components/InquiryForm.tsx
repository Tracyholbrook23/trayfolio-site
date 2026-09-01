"use client";

import { useState, type FormEvent } from "react";

const projectTypes = [
  "New website",
  "Redesign",
  "E-commerce / Shopify",
  "Ongoing care & support",
  "Something else",
];

const budgets = ["Under $1,000", "$1,000–$2,500", "$2,500–$5,000", "$5,000+", "Not sure yet"];

export default function InquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [projectType, setProjectType] = useState<string[]>([]);
  const [budget, setBudget] = useState(budgets[0]);
  const [message, setMessage] = useState("");

  function toggleType(type: string) {
    setProjectType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `Website project inquiry — ${business || name || "New lead"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Business: ${business || "—"}`,
      `Project type: ${projectType.length ? projectType.join(", ") : "Not specified"}`,
      `Budget: ${budget}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.location.href = `mailto:tracyholbrook532@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-700" htmlFor="inquiry-name">
            Your name
          </label>
          <input
            id="inquiry-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-900"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700" htmlFor="inquiry-email">
            Email
          </label>
          <input
            id="inquiry-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-900"
            placeholder="jane@business.com"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700" htmlFor="inquiry-business">
          Business / industry
        </label>
        <input
          id="inquiry-business"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          placeholder="e.g. home services, apparel, photography..."
        />
      </div>

      <div>
        <span className="text-sm font-medium text-zinc-700">What do you need?</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {projectTypes.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => toggleType(type)}
              aria-pressed={projectType.includes(type)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                projectType.includes(type)
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700" htmlFor="inquiry-budget">
          Budget range
        </label>
        <select
          id="inquiry-budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zinc-900"
        >
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700" htmlFor="inquiry-message">
          Tell me about your project
        </label>
        <textarea
          id="inquiry-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          placeholder="What does your business do, and what do you need from a website?"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:brightness-110 hover:shadow-fuchsia-500/40"
      >
        Send inquiry
      </button>
      <p className="text-xs text-zinc-500">
        This opens your email app with everything pre-filled so nothing gets lost — nothing
        sends until you hit send there.
      </p>
    </form>
  );
}
