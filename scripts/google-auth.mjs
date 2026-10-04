/**
 * One-time setup: get the Google refresh token that lets the site create
 * consultation events (with Google Meet links) on your calendar.
 *
 *   npm run google-auth
 *
 * Needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local, from a Google
 * Cloud OAuth client of type "Desktop app" (see docs/SEO-PROGRESS.md, "Google
 * Calendar + Meet"). Opens Google's consent page; sign in as the calendar owner
 * (georgekibew@gmail.com) and allow access. Prints GOOGLE_REFRESH_TOKEN to add
 * to .env.local and to Vercel. The permission asked for is limited to calendar
 * events (create / update / delete), nothing else in the account.
 */
import http from "node:http";
import { randomBytes, createHash } from "node:crypto";
import { exec } from "node:child_process";

const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/calendar.events";

const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

// PKCE + state, so the code can only be redeemed by this script
const verifier = randomBytes(32).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const state = randomBytes(16).toString("hex");

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: clientId,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: SCOPE,
  access_type: "offline", // ask for a refresh token
  prompt: "consent", // always return one, even if access was granted before
  code_challenge: challenge,
  code_challenge_method: "S256",
  state,
})}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/oauth2callback") return res.writeHead(404).end();
  const finish = (status, message) => {
    res.writeHead(status, { "content-type": "text/html; charset=utf-8" }).end(`<p style="font-family:sans-serif">${message}</p>`);
    server.close();
  };
  if (url.searchParams.get("state") !== state) return finish(400, "State mismatch. Run the script again.");
  if (url.searchParams.get("error")) {
    console.error(`Google returned an error: ${url.searchParams.get("error")}`);
    return finish(400, "Access was not granted. You can close this tab.");
  }
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: url.searchParams.get("code"),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    console.error("No refresh token returned:", data.error_description ?? data.error ?? data);
    return finish(500, "Something went wrong; see the terminal.");
  }
  console.log("\nSuccess. Add this to .env.local and to Vercel (Production), then redeploy:\n");
  console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}\n`);
  console.log("Keep it secret: it allows creating and deleting events on this calendar.");
  finish(200, "Done. Google Calendar is connected; you can close this tab and return to the terminal.");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Opening Google's consent page. If it doesn't open, visit:\n");
  console.log(authUrl + "\n");
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start \"\"" : "xdg-open";
  exec(`${opener} "${authUrl}"`, () => {});
});
