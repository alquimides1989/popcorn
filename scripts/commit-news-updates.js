const { spawnSync } = require("node:child_process");

const git = process.env.GIT_EXE || "C:\\Program Files\\Git\\cmd\\git.exe";
const files = [
  "data/noticias.json",
  "data/x-posts.json",
  "data/radar-sources.json",
  "data/engagement-sections.json",
  "POSTS_X_MANUAL.md",
  "calendario.html",
  "rumorometro.html",
  "ofertas.html",
  "juegos.html",
  "estudios.html",
  "index.html",
];

function run(args, options = {}) {
  const result = spawnSync(git, args, {
    encoding: "utf8",
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    const message = result.stderr || result.stdout || `git ${args.join(" ")} failed`;
    throw new Error(message.trim());
  }

  return result.stdout.trim();
}

function hasChanges() {
  const status = run(["status", "--porcelain", "--", ...files]);
  return Boolean(status);
}

function main() {
  if (!hasChanges()) {
    console.log("No hay cambios de noticias para subir.");
    return;
  }

  run(["add", ...files]);

  const timestamp = new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
  run(["commit", "-m", `Update news content ${timestamp}`]);
  run(["push", "origin", "main"]);

  console.log("Cambios de noticias subidos a GitHub.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
