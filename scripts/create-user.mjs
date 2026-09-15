// Creates (or updates) one login for the client dashboard. Always run this
// yourself, in your own terminal, never paste a password into chat: this
// prompts for it with the terminal's echo turned off so it never appears
// in your shell history or on screen.
//
// Usage: node scripts/create-user.mjs <email> [role]
// role defaults to OWNER. Other options: CLIENT_ADMIN, CLIENT_EDITOR.
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import readline from "node:readline";

function promptHidden(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let input = "";
    const onData = (char) => {
      if (char === "\n" || char === "\r" || char === "") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(input);
      } else if (char === "") {
        process.exit(1); // Ctrl+C
      } else if (char === "") {
        input = input.slice(0, -1); // backspace
      } else {
        input += char;
      }
    };
    stdin.on("data", onData);
  });
}

const [, , email, roleArg] = process.argv;
const role = roleArg || "OWNER";
const VALID_ROLES = ["OWNER", "CLIENT_ADMIN", "CLIENT_EDITOR"];

if (!email) {
  console.error("Usage: node scripts/create-user.mjs <email> [role]");
  console.error(`role defaults to OWNER. Other options: ${VALID_ROLES.filter((r) => r !== "OWNER").join(", ")}.`);
  process.exit(1);
}

if (!VALID_ROLES.includes(role)) {
  console.error(`Invalid role "${role}". Must be one of: ${VALID_ROLES.join(", ")}.`);
  process.exit(1);
}

const password = await promptHidden("Password (not shown as you type): ");
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const passwordHash = await bcrypt.hash(password, 12);

const rows = await sql`
  insert into users (email, password_hash, role)
  values (${email.toLowerCase()}, ${passwordHash}, ${role})
  on conflict (email) do update set password_hash = excluded.password_hash, role = excluded.role
  returning id, email, role
`;

console.log(`User ready: ${rows[0].email} (${rows[0].role}), id ${rows[0].id}`);
