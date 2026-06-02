const fs = require("node:fs");
const path = require("node:path");

const clientId = process.env.X_CLIENT_ID;
const clientSecret = process.env.X_CLIENT_SECRET;
const code = process.env.X_AUTH_CODE;
const stateFile = path.join(__dirname, "..", "data", "x-oauth-state.json");

if (!clientId || !clientSecret || !code) {
  console.error("Faltan X_CLIENT_ID, X_CLIENT_SECRET o X_AUTH_CODE.");
  process.exit(1);
}

const oauthState = JSON.parse(fs.readFileSync(stateFile, "utf8"));
const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

async function main() {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: oauthState.redirectUri,
    code_verifier: oauthState.codeVerifier,
  });

  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }

  const safe = {
    token_type: payload.token_type,
    expires_in: payload.expires_in,
    scope: payload.scope,
    has_access_token: Boolean(payload.access_token),
    has_refresh_token: Boolean(payload.refresh_token),
  };

  console.log(JSON.stringify(safe, null, 2));
  console.log("");
  console.log("ACCESS_TOKEN:");
  console.log(payload.access_token);
}

main();
