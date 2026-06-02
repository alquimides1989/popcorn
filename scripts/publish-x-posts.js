const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const POSTS_FILE = path.join(__dirname, "..", "data", "x-posts.json");
const API_URL = "https://api.x.com/2/tweets";
const MAX_POSTS = Number(process.env.X_MAX_POSTS || 1);
const TOKEN = process.env.X_USER_ACCESS_TOKEN;
const OAUTH1 = {
  apiKey: process.env.X_API_KEY,
  apiSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
};
const DRY_RUN = process.env.X_DRY_RUN === "1" || process.argv.includes("--dry-run");

function encode(value) {
  return encodeURIComponent(value).replace(/[!*()']/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function hasOAuth1() {
  return Boolean(OAUTH1.apiKey && OAUTH1.apiSecret && OAUTH1.accessToken && OAUTH1.accessTokenSecret);
}

function createOAuth1Header(method, url) {
  const params = {
    oauth_consumer_key: OAUTH1.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: OAUTH1.accessToken,
    oauth_version: "1.0",
  };

  const parameterString = Object.keys(params)
    .sort()
    .map((key) => `${encode(key)}=${encode(params[key])}`)
    .join("&");
  const signatureBase = [method.toUpperCase(), encode(url), encode(parameterString)].join("&");
  const signingKey = `${encode(OAUTH1.apiSecret)}&${encode(OAUTH1.accessTokenSecret)}`;
  params.oauth_signature = crypto.createHmac("sha1", signingKey).update(signatureBase).digest("base64");

  return `OAuth ${Object.keys(params)
    .sort()
    .map((key) => `${encode(key)}="${encode(params[key])}"`)
    .join(", ")}`;
}

async function readQueue() {
  const raw = await fs.readFile(POSTS_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeQueue(queue) {
  queue.updatedAt = new Date().toISOString();
  await fs.writeFile(POSTS_FILE, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
}

async function publishPost(text) {
  const authHeader = hasOAuth1()
    ? createOAuth1Header("POST", API_URL)
    : `Bearer ${TOKEN}`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload?.detail || payload?.title || response.statusText;
    throw new Error(`X API ${response.status}: ${detail}`);
  }

  return payload.data;
}

async function main() {
  const queue = await readQueue();
  const pending = queue.items
    .filter((item) => item.status === "pending_credentials" || item.status === "pending")
    .slice(0, MAX_POSTS);

  if (!pending.length) {
    console.log("No hay posts pendientes.");
    return;
  }

  if ((!TOKEN && !hasOAuth1()) || DRY_RUN) {
    for (const item of pending) {
      item.status = TOKEN ? "ready_dry_run" : "pending_credentials";
      item.lastCheckedAt = new Date().toISOString();
    }
    await writeQueue(queue);
    console.log(TOKEN || hasOAuth1() ? "Dry run completado." : "Faltan credenciales de X.");
    console.log(`Posts preparados: ${pending.length}`);
    return;
  }

  let posted = 0;
  for (const item of pending) {
    try {
      const result = await publishPost(item.text);
      item.status = "posted";
      item.postedAt = new Date().toISOString();
      item.xPostId = result?.id || null;
      item.lastError = null;
      posted += 1;
    } catch (error) {
      item.status = "error";
      item.lastError = error.message;
      item.lastCheckedAt = new Date().toISOString();
    }
  }

  await writeQueue(queue);
  console.log(`Publicados: ${posted}/${pending.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
