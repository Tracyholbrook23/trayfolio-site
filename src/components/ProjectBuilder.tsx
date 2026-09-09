"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ADD_ONS,
  PACKAGES,
  buildQuote,
  formatUSD,
  type AddOnId,
  type PackageId,
} from "@/lib/pricing";

const PACKAGE_ORDER: PackageId[] = ["starter", "growth", "signature"];
const ADD_ON_ORDER = Object.keys(ADD_ONS) as AddOnId[];
const GROUPS = ["The build", "Selling and booking", "Brand and content"];

export default function ProjectBuilder() {
  const params = useSearchParams();
  const requested = params.get("package");
  const initial: PackageId =
    requested && requested in PACKAGES ? (requested as PackageId) : "growth";

  const [packageId, setPackageId] = useState<PackageId>(initial);
  const [selected, setSelected] = useState<Partial<Record<AddOnId, number>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const pkg = PACKAGES[packageId];

  const addOns = useMemo(
    () =>
      (Object.entries(selected) as [AddOnId, number][])
        .filter(([id, qty]) => qty > 0 && !pkg.includes.includes(id))
        .map(([id, quantity]) => ({ id, quantity })),
    [selected, pkg]
  );

  // Same function the server uses, so the number on screen and the number
  // charged can never drift apart.
  const quote = useMemo(
    () => buildQuote({ packageId, addOns }),
    [packageId, addOns]
  );

  function toggle(id: AddOnId) {
    setSelected((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));
  }

  function setQuantity(id: AddOnId, quantity: number) {
    setSelected((prev) => ({ ...prev, [id]: Math.max(0, Math.min(40, quantity)) }));
  }

  async function checkout() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, addOns }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] lg:items-start">
      <div>
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Choose a package
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PACKAGE_ORDER.map((id) => {
              const option = PACKAGES[id];
              const active = id === packageId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPackageId(id)}
                  aria-pressed={active}
                  className={`border p-4 text-left transition ${
                    active
                      ? "border-terracotta bg-peach ring-1 ring-terracotta/40"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {option.label.replace(" package", "")}
                  </span>
                  <span className="font-display mt-1 block text-2xl font-semibold tracking-tight">
                    {formatUSD(option.amount)}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-stone-600">
                    {option.blurb}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {GROUPS.map((group) => {
          const ids = ADD_ON_ORDER.filter((id) => ADD_ONS[id].group === group);
          return (
            <fieldset key={group} className="mt-10">
              <legend className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {group}
              </legend>
              <div className="mt-3 divide-y divide-stone-200 border-t border-stone-200">
                {ids.map((id) => {
                  const addOn = ADD_ONS[id];
                  const included = pkg.includes.includes(id);
                  const quantity = selected[id] ?? 0;
                  const on = quantity > 0;

                  return (
                    <div key={id} className="flex items-start gap-4 py-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-sm font-semibold">{addOn.label}</span>
                          <span className="text-sm text-stone-500">
                            {included ? (
                              <span className="font-semibold text-olive">
                                Included in {pkg.label.replace(" package", "")}
                              </span>
                            ) : (
                              <>
                                {formatUSD(addOn.amount)}
                                {addOn.perUnit ? " each" : ""}
                              </>
                            )}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-stone-600">{addOn.note}</p>
                      </div>

                      {included ? null : addOn.perUnit ? (
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(id, quantity - 1)}
                            aria-label={`One fewer ${addOn.label}`}
                            className="h-8 w-8 border border-stone-300 text-stone-700 transition hover:border-stone-900"
                          >
                            &minus;
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(id, quantity + 1)}
                            aria-label={`One more ${addOn.label}`}
                            className="h-8 w-8 border border-stone-300 text-stone-700 transition hover:border-stone-900"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggle(id)}
                          aria-pressed={on}
                          className={`shrink-0 border px-4 py-2 text-sm font-semibold transition ${
                            on
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-300 text-stone-700 hover:border-stone-900"
                          }`}
                        >
                          {on ? "Added" : "Add"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <aside className="border border-stone-300 bg-peach p-6 lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Your project
        </p>

        <ul className="mt-4 space-y-2 border-b border-stone-900/15 pb-4 text-sm">
          {quote.lines.map((line) => (
            <li key={line.label} className="flex justify-between gap-4 text-stone-700">
              <span>
                {line.label}
                {line.quantity > 1 ? ` x${line.quantity}` : ""}
              </span>
              <span className="shrink-0 tabular-nums">
                {formatUSD(line.amount * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm font-semibold">Project total</span>
          <span className="font-display text-2xl font-semibold tabular-nums">
            {formatUSD(quote.total)}
          </span>
        </div>

        <div className="mt-5 space-y-1.5 border-t border-stone-900/15 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Due today</span>
            <span className="font-display text-lg font-semibold tabular-nums">
              {formatUSD(quote.depositDue)}
            </span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Due at launch</span>
            <span className="tabular-nums">{formatUSD(quote.balanceDue)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={checkout}
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-terracotta-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Opening checkout..." : `Pay ${formatUSD(quote.depositDue)} deposit`}
        </button>
        <p className="mt-3 text-xs leading-5 text-stone-600">Review the <a href="/terms" className="underline underline-offset-4">terms</a> and <a href="/privacy" className="underline underline-offset-4">privacy policy</a> before continuing.</p>

        {error ? (
          <p className="mt-3 text-sm leading-6 text-red-700" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-3 text-xs leading-5 text-stone-600">
            Secure checkout by Stripe. Already paid for a demo? Enter your credit code on
            the next screen.
          </p>
        )}
      </aside>
    </div>
  );
}
