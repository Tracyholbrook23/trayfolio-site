import "server-only";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "./session-options";

export type { Role, SessionData } from "./session-options";

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
