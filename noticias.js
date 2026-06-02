const CATEGORY_CLASS = {
  Xbox: "xbox",
  PlayStation: "play",
  Nintendo: "nintendo",
  PC: "pc",
  Multiplataforma: "pc",
  Cine: "cinema",
  Series: "series",
};

const CATEGORY_LINK = {
  Xbox: "./xbox.html",
  PlayStation: "./playstation.html",
  Nintendo: "./nintendo.html",
  PC: "./pc.html",
  Multiplataforma: "./videojuegos.html",
  Cine: "./cine.html",
  Series: "./series.html",
};

const FALLBACK_NEWS = {
  items: [
    {
      id: "bienvenida-pixel-popcorn",
      title: "Pixel & Popcorn prepara su radar de actualidad",
      summary:
        "La portada ya esta lista para recibir noticias clasificadas por plataforma, cine y series. Cuando la automatizacion encuentre nuevas piezas verificadas, apareceran aqui con fuente, enlace e imagen relacionada.",
      category: "Multiplataforma",
      source: "Pixel & Popcorn",
      url: "./index.html",
      detectedAt: "2026-06-02T00:00:00+02:00",
      confidence: "Contenido interno",
      image: {
        url: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=900&q=82",
        alt: "Mando de videojuegos iluminado",
        credit: "Unsplash",
        sourceUrl: "https://unsplash.com/",
      },
    },
  ],
};

const EDITORIAL_IMAGES = {
  Cine: [
    {
      url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=82",
      alt: "Sala de cine con pantalla y butacas",
    },
    {
      url: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=82",
      alt: "Camara y equipo de rodaje",
    },
    {
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=82",
      alt: "Butacas de cine iluminadas",
    },
  ],
  Series: [
    {
      url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=900&q=82",
      alt: "Television con ambiente de streaming",
    },
    {
      url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=900&q=82",
      alt: "Persona viendo contenido en television",
    },
    {
      url: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=82",
      alt: "Salon preparado para ver series",
    },
  ],
};

const escapeText = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

const getCategoryClass = (category) => CATEGORY_CLASS[category] || "pc";
const getCategoryLink = (category) => CATEGORY_LINK[category] || "./videojuegos.html";

function isLogoLikeImage(image) {
  const url = String(image?.url || "").toLowerCase();
  const alt = String(image?.alt || "").toLowerCase();
  const kind = String(image?.kind || "").toLowerCase();
  return (
    kind === "logo" ||
    !url ||
    url.includes("simpleicons") ||
    url.includes("wikimedia") ||
    url.includes("logo") ||
    alt.includes("logo") ||
    alt.includes("logotipo")
  );
}

function getNewsImage(item, index = 0) {
  const editorialSet = EDITORIAL_IMAGES[item.category];
  if (editorialSet && isLogoLikeImage(item.image)) {
    return editorialSet[index % editorialSet.length];
  }

  if (item.image?.url) {
    return item.image;
  }

  if (editorialSet) {
    return editorialSet[index % editorialSet.length];
  }

  return FALLBACK_NEWS.items[0].image;
}
const isLogoImage = (url = "") =>
  url.includes("simpleicons.org") || url.endsWith(".svg") || url.includes("wikimedia.org");

function renderArticleBody(item) {
  const paragraphs = Array.isArray(item.body) && item.body.length ? item.body : [item.summary];
  return paragraphs
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeText(paragraph)}</p>`)
    .join("");
}

function sortNews(items) {
  return [...items].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    const dateA = new Date(a.publishedAt || a.detectedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || b.detectedAt || 0).getTime();
    return dateB - dateA;
  });
}

async function loadNews() {
  try {
    const response = await fetch("./data/noticias.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No news data");
    const data = await response.json();
    return Array.isArray(data.items) && data.items.length ? data : FALLBACK_NEWS;
  } catch {
    return FALLBACK_NEWS;
  }
}

function renderTicker(items) {
  const ticker = document.querySelector("[data-news-ticker]");
  if (!ticker) return;

  const headlines = items.slice(0, 5).map((item) => `<span>${escapeText(item.title)}</span>`).join("");
  ticker.innerHTML = `<strong><span aria-hidden="true">&#9889;</span> Ultima hora</strong>${headlines}`;
}

function renderNow(items) {
  const panel = document.querySelector("[data-news-now]");
  if (!panel) return;

  const cards = items.slice(0, 4).map((item) => {
    const category = escapeText(item.category || "Actualidad");
    const className = getCategoryClass(item.category);
    const href = getCategoryLink(item.category);
    const logoClass = isLogoImage(item.image?.url) ? " logo-style" : "";
    const image = item.image?.url
      ? `<img src="${escapeText(item.image.url)}" alt="" loading="lazy" />`
      : `<span>${category.slice(0, 2)}</span>`;

    return `
      <a class="now-item ${className}" href="${href}">
        <span class="logo-mark news-logo${logoClass}">${image}</span>
        <span>
          <strong>${escapeText(item.title)}</strong>
          <small><b>${category}</b> · ${escapeText(item.source || "Fuente")}</small>
        </span>
      </a>
    `;
  }).join("");

  panel.innerHTML = `<h2>Ahora mismo</h2>${cards}`;
}

function renderGrid(items) {
  const grid = document.querySelector("[data-news-grid]");
  if (!grid) return;

  grid.innerHTML = items.slice(0, 8).map((item, index) => {
    const category = escapeText(item.category || "Actualidad");
    const className = getCategoryClass(item.category);
    const isWide = index >= 4 || item.category === "Cine" || item.category === "Series";
    const articleClass = isWide ? `wide-card ${className}` : `news-card ${className}`;
    const newsImage = getNewsImage(item, index);
    const image = newsImage.url;
    const imageAlt = newsImage.alt || item.title || "Imagen relacionada";
    const mediaClass = isLogoImage(image) || newsImage.kind === "logo" ? "news-art logo-style" : "news-art photo-style";
    const credit = item.image?.credit ? `<small class="image-credit">${escapeText(item.image.credit)}</small>` : "";
    const source = item.source ? `<p class="source-note">Fuente: ${escapeText(item.source)}</p>` : "";
    const confidence = item.confidence ? `<span>${escapeText(item.confidence)}</span>` : "";

    if (isWide) {
      return `
        <article class="${articleClass}">
          <div class="wide-art ${mediaClass}">
            <img src="${escapeText(image)}" alt="${escapeText(imageAlt)}" loading="lazy" />
            ${credit}
          </div>
          <div>
            <span class="label">${category}</span>
            <h3>${escapeText(item.title)}</h3>
            <p>${escapeText(item.summary)}</p>
            <div class="article-meta">${confidence}</div>
            ${source}
          </div>
        </article>
      `;
    }

    return `
      <article class="${articleClass}">
        <div class="brand-stage ${mediaClass}">
          <img src="${escapeText(image)}" alt="${escapeText(imageAlt)}" loading="lazy" />
          ${credit}
        </div>
        <div class="news-copy">
          <span class="label">${category}</span>
          <h3>${escapeText(item.title)}</h3>
          <p>${escapeText(item.summary)}</p>
          ${source}
        </div>
      </article>
    `;
  }).join("");
}

function renderList(items) {
  const list = document.querySelector("[data-news-list]");
  if (!list) return;

  const categoryFilter = document.body.dataset.category;
  const groupFilter = document.body.dataset.group;
  const gamingCategories = ["Xbox", "PlayStation", "Nintendo", "PC", "Multiplataforma"];
  const filtered = categoryFilter
    ? items.filter((item) => item.category === categoryFilter)
    : groupFilter === "videojuegos"
      ? items.filter((item) => gamingCategories.includes(item.category))
      : items;

  list.innerHTML = filtered.slice(0, 12).map((item, index) => {
    const category = escapeText(item.category || "Actualidad");
    const newsImage = getNewsImage(item, index);
    const image = newsImage.url;
    const imageAlt = newsImage.alt || item.title || "Imagen relacionada";
    const mediaClass = isLogoImage(image) || newsImage.kind === "logo" ? "news-art logo-style" : "news-art photo-style";
    const published = item.publishedAt || item.detectedAt || "";
    const dateText = published ? new Date(published).toLocaleDateString("es-ES") : "Actualidad";
    const source = item.source ? `<p class="source-note">Fuente: ${escapeText(item.source)}</p>` : "";

    return `
      <article class="article-row ${getCategoryClass(item.category)}">
        <div class="article-thumb ${mediaClass}">
          <img src="${escapeText(image)}" alt="${escapeText(imageAlt)}" loading="lazy" />
        </div>
        <div>
          <div class="article-meta">
            <span>${category}</span>
            <span>${escapeText(dateText)}</span>
          </div>
          <h3>${escapeText(item.title)}</h3>
          <div class="article-body">${renderArticleBody(item)}</div>
          ${source}
        </div>
      </article>
    `;
  }).join("");
}

loadNews().then((data) => {
  const items = sortNews(data.items || []);
  renderTicker(items);
  renderNow(items);
  renderGrid(items);
  renderList(items);
});
