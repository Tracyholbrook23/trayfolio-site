// Pushes website leads into HighLevel (LeadConnector API v2).
// Uses plain fetch, same as the Stripe and Resend integrations, so no SDK install is needed.
//
// Env vars (set in Vercel):
//   GHL_PRIVATE_TOKEN  Private Integration token from the HighLevel sub-account
//   GHL_LOCATION_ID    The sub-account (location) id
// Without both, pushLead is a no-op and the form still emails Tracy through Resend.
//
// Tagging the contact with LEAD_TAG is what fires the "Website Lead" workflow in HighLevel.
// The tag is removed and re-added on every submission so returning visitors fire it again.

const API_BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";
const REQUEST_TIMEOUT_MS = 8_000;

export const LEAD_TAG = "website lead";
const SMS_CONSENT_TAG = "sms consent";
const LEAD_SOURCE = "Trayfolio website";

export type Lead = {
  name: string;
  email: string;
  phone: string;
  business: string;
  projectTypes: string[];
  message: string;
  smsConsent: boolean;
};

export function highLevelConfigured() {
  return Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);
}

// HighLevel wants E.164. Most visitors type a 10 digit US number.
export function toE164(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+") && digits.length >= 8) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return "";
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  const firstName = parts.shift() ?? "";
  return { firstName, lastName: parts.join(" ") };
}

async function ghl(path: string, method: string, body?: unknown) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
      Version: API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`HighLevel ${method} ${path} failed with ${response.status}`);
  }
  return data as Record<string, unknown>;
}

/** Creates or updates the contact, saves the inquiry, then tags it to start the workflow. */
export async function pushLead(lead: Lead) {
  const locationId = process.env.GHL_LOCATION_ID;
  const { firstName, lastName } = splitName(lead.name);
  const phone = toE164(lead.phone);
  const projectType = lead.projectTypes.join(", ") || "Not specified";

  const upsert = await ghl("/contacts/upsert", "POST", {
    locationId,
    firstName,
    lastName,
    name: lead.name,
    email: lead.email,
    ...(phone ? { phone } : {}),
    ...(lead.business ? { companyName: lead.business } : {}),
    source: LEAD_SOURCE,
    customFields: [
      { key: "website_inquiry", field_value: lead.message },
      { key: "project_type", field_value: projectType },
    ],
  });

  const contact = upsert.contact as { id?: string } | undefined;
  const contactId = contact?.id;
  if (!contactId) throw new Error("HighLevel upsert returned no contact id");

  await ghl(`/contacts/${contactId}/notes`, "POST", {
    body: [
      `Website inquiry (${new Date().toISOString().slice(0, 10)})`,
      `Business: ${lead.business || "Not given"}`,
      `Project: ${projectType}`,
      `SMS consent: ${lead.smsConsent ? "yes" : "no"}`,
      "",
      lead.message,
    ].join("\n"),
  }).catch(() => undefined);

  const tags = lead.smsConsent && phone ? [LEAD_TAG, SMS_CONSENT_TAG] : [LEAD_TAG];
  await ghl(`/contacts/${contactId}/tags`, "DELETE", { tags: [LEAD_TAG] }).catch(() => undefined);
  await ghl(`/contacts/${contactId}/tags`, "POST", { tags });

  return contactId;
}
