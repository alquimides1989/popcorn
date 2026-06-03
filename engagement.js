function getShareText() {
  const headline = document.querySelector("[data-news-grid] h3")?.textContent?.trim();
  return headline
    ? `BluePoint: ${headline}`
    : "BluePoint resume lo mejor de PlayStation, PS5 y State of Play";
}

function setShareStatus(message) {
  const status = document.querySelector("[data-share-status]");
  if (status) status.textContent = message;
}

async function copyCurrentLink() {
  const url = window.location.href.split("?")[0];
  try {
    await navigator.clipboard.writeText(url);
    setShareStatus("Enlace copiado.");
  } catch {
    setShareStatus("No se pudo copiar automaticamente.");
  }
}

async function shareCurrentPage() {
  const url = window.location.href.split("?")[0];
  const text = getShareText();

  if (navigator.share) {
    try {
      await navigator.share({ title: "BluePoint", text, url });
      setShareStatus("Gracias por compartir BluePoint.");
      return;
    } catch {
      return;
    }
  }

  await copyCurrentLink();
}

document.querySelector("[data-share='native']")?.addEventListener("click", shareCurrentPage);
document.querySelector("[data-copy-link]")?.addEventListener("click", copyCurrentLink);
