const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const clientId = process.env.X_CLIENT_ID;
const redirectUri = process.env.X_REDIRECT_URI || "http://127.0.0.1:5173/callback";

if (!clientId) {
  console.error("Falta X_CLIENT_ID.");
  process.exit(1);
}

function base64Url(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const codeVerifier = base64Url(crypto.randomBytes(48));
const codeChallenge = base64Url(crypto.createHash("sha256").update(codeVerifier).digest());
const state = base64Url(crypto.randomBytes(24));
const scope = ["tweet.read", "tweet.write", "users.read", "offline.access"].join(" ");

const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("scope", scope);
authUrl.searchParams.set("state", state);
authUrl.searchParams.set("code_challenge", codeChallenge);
authUrl.searchParams.set("code_challenge_method", "S256");

const stateFile = path.join(__dirname, "..", "data", "x-oauth-state.json");
fs.writeFileSync(
  stateFile,
  `${JSON.stringify({ codeVerifier, state, redirectUri, createdAt: new Date().toISOString() }, null, 2)}\n`,
  "utf8",
);

console.log(authUrl.toString());
