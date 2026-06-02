const fs = require("node:fs");

const queue = JSON.parse(fs.readFileSync("data/x-posts.json", "utf8"));
const pending = queue.items.filter((item) => item.status !== "posted");

const lines = [
  "# Posts manuales para X - Pixel & Popcorn",
  "",
  `Generado: ${new Date().toISOString()}`,
  "",
  "Copia cada bloque de texto en X. Los hashtags ya van incluidos dentro del post.",
  "",
];

pending.forEach((post, index) => {
  lines.push(
    `## ${index + 1}. ${post.newsId}`,
    "",
    post.text,
    "",
    `Caracteres: ${post.text.length}`,
    `Imagen sugerida: ${post.imageAlt || "Sin imagen"}`,
    `Credito imagen: ${post.imageCredit || "Sin credito"}`,
    "",
  );
});

fs.writeFileSync("POSTS_X_MANUAL.md", `${lines.join("\n")}\n`, "utf8");
console.log(`POSTS_X_MANUAL.md generado con ${pending.length} posts.`);
