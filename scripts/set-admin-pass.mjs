// One-time setup: writes a salted sha256 credential to src/messages/admin.json.
// Usage: node scripts/set-admin-pass.mjs <user> <password-min-16-chars>
// Commit + redeploy afterwards — the proxy reads the JSON at build time.
import { createHash, randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";

const [user, pass] = process.argv.slice(2);
if (!user || !pass || pass.length < 16) {
  console.error("usage: node scripts/set-admin-pass.mjs <user> <password-min-16-chars>");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
const hash = createHash("sha256").update(`${salt}:${user}:${pass}`).digest("hex");
await writeFile(
  new URL("../src/messages/admin.json", import.meta.url),
  `${JSON.stringify({ user, salt, hash }, null, 2)}\n`,
);
console.log("admin.json updated. Commit + redeploy to apply.");
