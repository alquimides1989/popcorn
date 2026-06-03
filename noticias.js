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
  Xbox: "./playstation.html",
  PlayStation: "./playstation.html",
  Nintendo: "./playstation.html",
  PC: "./playstation.html",
  Multiplataforma: "./playstation.html",
  Cine: "./playstation.html",
  Series: "./playstation.html",
};

const SECTION_MATCHERS = {
  "state-of-play": (item) => hasAny(item, ["State of Play", "Showcase", "Presentacion"]),
  "ps-plus": (item) => hasAny(item, ["PS Plus", "PlayStation Plus", "Servicios"]),
  exclusivos: (item) =>
    hasAny(item, [
      "PlayStation Studios",
      "Exclusivos",
      "Marvel's Wolverine",
      "Saros",
      "Intergalactic",
      "Ghost of Yotei",
      "Housemarque",
      "Naughty Dog",
      "Insomniac",
      "Sucker Punch",
    ]),
  rumores: (item) => hasAny(item, ["Rumor", "Rumores"]) || /rumor/i.test(item.confidence || ""),
  guias: (item) => hasAny(item, ["Guia", "Guias", "Consejos"]),
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

const RELATED_IMAGE_RULES = [
  {
    terms: ["State of Play", "Marvel's Wolverine", "Wolverine"],
    image: {
      url: "https://blog.playstation.com/tachyon/2086/05/a752370ce16df03754ac285695174544a31bf13e.png?crop_strategy=smart&resize=1088%2C612",
      alt: "Grafico oficial del State of Play del 2 de junio",
      kind: "graphic",
      credit: "PlayStation Blog",
      sourceUrl: "https://blog.playstation.com/2026/05/20/state-of-play-returns-tuesday-june-2/",
    },
  },
  {
    terms: ["PS Plus", "PlayStation Plus", "Grounded", "Darktide", "Nickelodeon"],
    image: {
      url: "https://blog.playstation.com/tachyon/2026/05/7ceda89d7b005abcfaafbf018adca62bd6beb679-scaled.jpg?crop_strategy=smart&resize=1088%2C612",
      alt: "Imagen oficial de los juegos mensuales de PlayStation Plus de junio",
      kind: "graphic",
      credit: "PlayStation Blog",
      sourceUrl:
        "https://blog.playstation.com/2026/05/26/playstation-plus-monthly-games-for-june-grounded-fully-yoked-edition-nickelodeon-all-star-brawl-2-warhammer-40000-darktide/",
    },
  },
];

const EDITORIAL_IMAGES = {
  PlayStation: [
    {
      url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=82",
      alt: "Mando DualSense sobre una mesa iluminada",
      kind: "photo",
      credit: "Unsplash",
      sourceUrl: "https://unsplash.com/",
    },
    {
      url: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=1200&q=82",
      alt: "Mando de videojuegos iluminado en azul",
      kind: "photo",
      credit: "Unsplash",
      sourceUrl: "https://unsplash.com/",
    },
  ],
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
let activeItems = [];

function hasAny(item, values) {
  const haystack = [item.title, item.summary, item.category, ...(Array.isArray(item.tags) ? item.tags : [])].join(" ");
  return values.some((value) => haystack.toLowerCase().includes(value.toLowerCase()));
}

function filterItemsForPage(items) {
  const categoryFilter = document.body.dataset.category;
  const groupFilter = document.body.dataset.group;
  const sectionFilter = document.body.dataset.section;
  const gamingCategories = ["Xbox", "PlayStation", "Nintendo", "PC", "Multiplataforma"];

  if (sectionFilter && SECTION_MATCHERS[sectionFilter]) {
    return items.filter((item) => item.category === "PlayStation" && SECTION_MATCHERS[sectionFilter](item));
  }

  if (categoryFilter) {
    return items.filter((item) => item.category === categoryFilter);
  }

  if (groupFilter === "playstation") {
    return items.filter((item) => item.category === "PlayStation");
  }

  if (groupFilter === "videojuegos") {
    return items.filter((item) => gamingCategories.includes(item.category));
  }

  return items;
}

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
  const relatedImage = getRelatedImage(item);
  if (relatedImage && isLogoLikeImage(item.image)) {
    return relatedImage;
  }

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

function getRelatedImage(item) {
  const haystack = [item.title, item.summary, item.source, ...(Array.isArray(item.tags) ? item.tags : [])].join(" ");
  return RELATED_IMAGE_RULES.find((rule) =>
    rule.terms.some((term) => haystack.toLowerCase().includes(term.toLowerCase()))
  )?.image;
}
const isLogoImage = (url = "") =>
  url.includes("simpleicons.org") || url.endsWith(".svg") || url.includes("wikimedia.org");

function getMediaClass(image) {
  if (image?.kind === "graphic") return "news-art graphic-style";
  if (isLogoImage(image?.url) || image?.kind === "logo") return "news-art logo-style";
  return "news-art photo-style";
}

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
    const newsImage = getNewsImage(item);
    const logoClass = newsImage?.kind === "graphic" ? " graphic-style" : isLogoImage(newsImage?.url) ? " logo-style" : "";
    const image = newsImage?.url
      ? `<img src="${escapeText(newsImage.url)}" alt="" loading="lazy" />`
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
    const newsImage = getNewsImage(item, index);
    const isWide = newsImage.kind === "graphic" || index >= 4 || item.category === "Cine" || item.category === "Series";
    const articleClass = isWide ? `wide-card ${className}` : `news-card ${className}`;
    const image = newsImage.url;
    const imageAlt = newsImage.alt || item.title || "Imagen relacionada";
    const mediaClass = getMediaClass(newsImage);
    const credit = newsImage.credit ? `<small class="image-credit">${escapeText(newsImage.credit)}</small>` : "";
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

function setupNewsSearch(items) {
  const input = document.querySelector("[data-news-search]");
  if (!input) return;

  const status = document.querySelector("[data-search-status]");
  const runSearch = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = query
      ? items.filter((item) =>
          [
            item.title,
            item.summary,
            item.source,
            item.confidence,
            ...(Array.isArray(item.tags) ? item.tags : []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
      : items;

    renderGrid(filtered);
    renderNow(filtered);

    if (status) {
      status.textContent = query
        ? `${filtered.length} resultado${filtered.length === 1 ? "" : "s"} para "${input.value.trim()}".`
        : "Mostrando la seleccion editorial de portada.";
    }
  };

  input.addEventListener("input", runSearch);
  runSearch();
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
    const mediaClass = getMediaClass(newsImage);
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
  const items = filterItemsForPage(sortNews(data.items || []));
  activeItems = items;
  renderTicker(items);
  renderNow(items);
  renderGrid(items);
  renderList(items);
  setupNewsSearch(items);
});
