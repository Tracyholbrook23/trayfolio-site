import { NextResponse } from "next/server";

// Bound reads even when Content-Length is absent or dishonest. Applies only to
// public JSON forms, never the Stripe webhook (which needs its raw signed body).
export async function readSubmission(request: Request): Promise<
  { ok: true; data: unknown } | { ok: false; response: NextResponse }
> {
  const reject = (error: string, status: number) => ({ ok: false as const, response: NextResponse.json({ error }, { status }) });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reject("Please submit this form from the website.", 403);
  if (request.headers.get("sec-fetch-site") === "cross-site") return reject("Please submit this form from the website.", 403);
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return reject("Send a JSON request.", 415);
  const limit = 16_384;
  if (Number(request.headers.get("content-length")) > limit) return reject("Your message is too long.", 413);
  const reader = request.body?.getReader();
  if (!reader) return reject("Invalid request.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        return reject("Your message is too long.", 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return { ok: true, data: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch { return reject("Invalid request.", 400); }
  finally { reader.releaseLock(); }
}
