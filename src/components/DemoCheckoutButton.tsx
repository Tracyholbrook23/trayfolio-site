"use client";

import { useState } from "react";

export default function DemoCheckoutButton({ className = "" }: { className?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "demo" }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={start}
        disabled={submitting}
        className="rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Opening checkout..." : "Get a $50 demo"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
