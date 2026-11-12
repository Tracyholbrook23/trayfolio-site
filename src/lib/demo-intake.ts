/**
 * The questions a visitor answers before ordering a $50 demo. The browser
 * shows them one at a time, and the server uses the same list to check
 * answers, save unfinished forms, and label them in emails, so the three
 * can never drift apart.
 *
 * Every limit stays at or under 500 characters because answers ride along
 * with the Stripe checkout session as metadata, and Stripe caps a metadata
 * value at 500.
 */

export type DemoAnswerKey =
  | "name"
  | "email"
  | "business"
  | "about"
  | "location"
  | "goal"
  | "details"
  | "website"
  | "brand"
  | "style";

export type DemoAnswers = Record<DemoAnswerKey, string>;

export type DemoField = {
  key: DemoAnswerKey;
  /** Short label for emails and the review screen. */
  label: string;
  max: number;
  optional?: boolean;
  /** Fixed choices the visitor taps instead of typing. */
  choices?: readonly string[];
};

export const GOAL_CHOICES = [
  "Get more bookings or calls",
  "Get more quote requests",
  "Sell products online",
  "Show off my work",
  "Something else",
] as const;

export const BRAND_CHOICES = [
  "Logo and brand colors",
  "Just a logo",
  "Not yet, surprise me",
] as const;

export const DEMO_FIELDS: DemoField[] = [
  { key: "name", label: "Name", max: 100 },
  { key: "email", label: "Email", max: 254 },
  { key: "business", label: "Business", max: 150 },
  { key: "about", label: "What they do", max: 300 },
  { key: "location", label: "Where and who they serve", max: 300 },
  { key: "goal", label: "Main goal", max: 100, choices: GOAL_CHOICES },
  { key: "details", label: "Wants the demo to show", max: 500 },
  { key: "website", label: "Current site or social", max: 200, optional: true },
  { key: "brand", label: "Logo and colors", max: 100, choices: BRAND_CHOICES },
  { key: "style", label: "Styles they like", max: 300, optional: true },
];

export const EMPTY_ANSWERS: DemoAnswers = {
  name: "",
  email: "",
  business: "",
  about: "",
  location: "",
  goal: "",
  details: "",
  website: "",
  brand: "",
  style: "",
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* *************************
 * checkDemoAnswer
 * Checks one answer against its field's rules.
 *
 * @param field : the field being answered
 * @param value : what the visitor typed or picked
 * @exception none
 * @return an error message to show, or "" when the answer is fine
 **************************/
export function checkDemoAnswer(field: DemoField, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return field.optional ? "" : "This one's needed to build your demo.";
  if (trimmed.length > field.max) return `Keep it under ${field.max} characters.`;
  if (field.key === "email" && !EMAIL_PATTERN.test(trimmed)) return "That email doesn't look quite right.";
  if (field.choices && !field.choices.includes(trimmed)) return "Pick one of the options.";
  return "";
}

/* *************************
 * readDemoAnswers
 * Cleans up answers sent from the browser. With `complete` set, every
 * required answer must be there (used right before payment). Without it,
 * blanks are allowed (used when saving a form that's still in progress),
 * but anything that is filled in must still be valid.
 *
 * @param raw : the answers object from the request body
 * @param complete : whether every required answer must be filled in
 * @exception none
 * @return the cleaned answers, or an error message
 **************************/
export function readDemoAnswers(
  raw: unknown,
  complete: boolean,
): { ok: true; data: DemoAnswers } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Tell me a little about your business first." };
  }
  const input = raw as Record<string, unknown>;
  const data = { ...EMPTY_ANSWERS };
  for (const field of DEMO_FIELDS) {
    const value = typeof input[field.key] === "string" ? (input[field.key] as string).trim() : "";
    if (!value && !complete) continue;
    const problem = checkDemoAnswer(field, value);
    if (problem) {
      return { ok: false, error: problem === "This one's needed to build your demo." ? "Please answer all the questions first." : problem };
    }
    data[field.key] = value;
  }
  return { ok: true, data };
}
