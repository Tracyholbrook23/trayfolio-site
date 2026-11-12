"use client";

import { useState } from "react";

/* *************************
 * UnsubscribeButton
 * Stops demo reminder emails when clicked. It takes a click on purpose:
 * some email security scanners open every link in a message, and a page
 * that unsubscribed on load would get triggered by them.
 *
 * @param token : the saved form's token from the email link
 * @exception none
 * @return the button, or a confirmation once it worked
 **************************/
export default function UnsubscribeButton({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");

  async function stop() {
    setState("working");
    try {
      const response = await fetch(`/api/demo-lead/unsubscribe?token=${encodeURIComponent(token)}`, { method: "POST" });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="mt-8 rounded-2xl bg-white/70 p-5 font-semibold text-stone-800">Done. You won&apos;t get any more reminders about this demo.</p>;
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={stop}
        disabled={state === "working"}
        className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
      >
        {state === "working" ? "Stopping..." : "Stop reminder emails"}
      </button>
      {state === "error" && (
        <p className="mt-4 text-sm text-red-700" role="alert">
          That didn&apos;t work. Reply to the reminder email and I&apos;ll stop them myself.
        </p>
      )}
    </div>
  );
}
