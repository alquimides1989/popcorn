const fs = require("node:fs");

const scriptVersion = "11";
const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

const engagement = readJson("data/engagement-sections.json", {
  calendar: [],
  reviews: [],
  rumorMeter: [],
  deals: [],
  gameHubs: [],
  studios: [],
});

const head = (title) => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title === "BluePoint" ? "BluePoint" : `${title} | BluePoint`}</title>
    <meta name="description" content="${title === "BluePoint" ? "BluePoint cubre noticias de PS5, State of Play, PS Plus, exclusivos PlayStation, rumores y trailers oficiales con contexto para jugadores." : `${title} de BluePoint: actualidad PlayStation, PS5, State of Play, PS Plus, exclusivos y rumores con informacion clara para jugadores.`}" />
    <meta name="theme-color" content="#03070d" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title === "BluePoint" ? "BluePoint" : `${title} | BluePoint`}" />
    <meta property="og:description" content="Actualidad PlayStation con noticias de PS5, State of Play, PS Plus, exclusivos, rumores y trailers oficiales." />
    <meta property="og:image" content="./assets/bluepoint-wordmark-white.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="manifest" href="./site.webmanifest" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "BluePoint",
        "description": "Actualidad PlayStation, PS5, State of Play, PS Plus, exclusivos y rumores.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "./index.html?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="icon" href="./assets/bluepoint-symbol-white.png" type="image/png" />
    <link rel="stylesheet" href="./styles.css?v=${scriptVersion}" />
    <script src="./noticias.js?v=${scriptVersion}" defer></script>
    <script src="./poll.js?v=${scriptVersion}" defer></script>
    <script src="./engagement.js?v=${scriptVersion}" defer></script>
  </head>`;

const playStationGlyph = `<svg width="96" height="96" viewBox="0 0 24 24" role="img" aria-label="PlayStation" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z" />
          </svg>`;

const sectionIcon = (name) => `<span class="section-icon official-ps-icon ${name}-icon" aria-hidden="true">
          ${playStationGlyph}
        </span>`;

const nav = (active) => {
  const items = [
    ["Inicio", "index.html"],
    ["Noticias PS5", "playstation.html"],
    ["Calendario", "calendario.html"],
    ["PS Plus", "ps-plus.html"],
    ["Rumores", "rumores.html"],
    ["Juegos", "juegos.html"],
  ];

  return `<header class="site-header">
      <a class="brand bluepoint-brand" href="./index.html" aria-label="BluePoint">
        <img class="brand-wordmark" src="./assets/bluepoint-wordmark-white.png" alt="BluePoint" />
      </a>
      <nav class="nav" aria-label="Principal">
        ${items.map(([label, href]) => `<a${label === active ? ' class="active"' : ""} href="./${href}">${label}</a>`).join("\n        ")}
      </nav>
      <a class="learn" href="./playstation.html">Noticias <span aria-hidden="true">&gt;</span></a>
    </header>`;
};

const sectionPage = ({ file, title, active, bodyAttr, label, heading, copy, icon }) => {
  const html = `${head(title)}
  <body ${bodyAttr}>
    ${nav(active)}
    <main class="page-shell">
      <section class="section-hero play-theme">
        <div>
          <span class="label">${label}</span>
          <h1>${heading}</h1>
          <p>${copy}</p>
        </div>
        <div class="section-logo">${sectionIcon(icon)}</div>
      </section>
      <section class="section-layout news-only"><div class="article-stack" data-news-list></div></section>
    </main>
  </body>
</html>
`;
  fs.writeFileSync(file, html, "utf8");
};

const resourcePage = ({ file, title, active, label, heading, copy, icon, content }) => {
  const html = `${head(title)}
  <body>
    ${nav(active)}
    <main class="page-shell">
      <section class="section-hero play-theme">
        <div>
          <span class="label">${label}</span>
          <h1>${heading}</h1>
          <p>${copy}</p>
        </div>
        <div class="section-logo">${sectionIcon(icon)}</div>
      </section>
      ${content}
    </main>
  </body>
</html>
`;
  fs.writeFileSync(file, html, "utf8");
};

const calendarContent = `<section class="resource-section">
        <div class="section-heading">
          <h2>Calendario PS5</h2>
          <p>Fechas, reservas, lanzamientos y eventos que el radar debe revisar cada dia.</p>
        </div>
        <div class="timeline-grid">
          ${engagement.calendar
            .map(
              (item) => `<article class="timeline-card">
            <time datetime="${item.date}">${item.label}</time>
            <span class="label">${item.type}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <small>Fuente: ${item.source}</small>
          </article>`
            )
            .join("\n          ")}
        </div>
      </section>`;

const rumorometerContent = `<section class="resource-section">
        <div class="section-heading">
          <h2>Rumorometro</h2>
          <p>Rumores con contexto y confianza visible para generar conversacion sin vender humo.</p>
        </div>
        <div class="resource-grid">
          ${engagement.rumorMeter
            .map(
              (item) => `<article class="resource-card">
            <span class="label">Confianza ${item.level}</span>
            <h3>${item.title}</h3>
            <div class="meter-line"><span style="width: ${item.confidence}%"></span></div>
            <p>${item.summary}</p>
            <small>Fuente: ${item.source}</small>
          </article>`
            )
            .join("\n          ")}
        </div>
      </section>`;

const dealsContent = `<section class="resource-section">
        <div class="section-heading">
          <h2>Ofertas PS Store</h2>
          <p>Zona preparada para rebajas, reservas, hardware y futura monetizacion por afiliacion.</p>
        </div>
        <div class="resource-grid">
          ${engagement.deals
            .map(
              (item) => `<article class="resource-card deal-resource">
            <span class="label">${item.type}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <a href="${item.url}" target="_blank" rel="sponsored noopener">${item.cta} -&gt;</a>
          </article>`
            )
            .join("\n          ")}
        </div>
      </section>`;

const gamesContent = `<section class="resource-section">
        <div class="section-heading">
          <h2>Fichas de juegos</h2>
          <p>Centros vivos por juego para concentrar noticias, trailers, reviews, rumores y guias.</p>
        </div>
        <div class="resource-grid game-hub-grid">
          ${engagement.gameHubs
            .map(
              (item) => `<article class="resource-card game-resource">
            <div class="game-cover">
              <img src="${item.image?.url || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=82"}" alt="${item.image?.alt || item.title}" loading="lazy" />
            </div>
            <div class="game-resource-copy">
              <div class="game-meta-row">
                <span class="label">${item.year || "PS5"}</span>
                <span class="game-score">${item.metascore || "N/D"} <small>Meta</small></span>
              </div>
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
              <small>${item.studio} · ${item.status}</small>
              <a href="${item.url || "#"}" target="_blank" rel="noopener">Ver ficha oficial -&gt;</a>
            </div>
            <div class="tag-row">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
          </article>`
            )
            .join("\n          ")}
        </div>
      </section>`;

const studiosContent = `<section class="resource-section">
        <div class="section-heading">
          <h2>Radar de estudios</h2>
          <p>Seguimiento de PlayStation Studios y socios clave para anticipar lo que interesa a la comunidad.</p>
        </div>
        <div class="resource-grid">
          ${engagement.studios
            .map(
              (item) => `<article class="resource-card studio-resource">
            <span class="label">Prioridad ${item.priority}</span>
            <h3>${item.name}</h3>
            <p>${item.summary}</p>
            <small>Foco actual: ${item.focus}</small>
          </article>`
            )
            .join("\n          ")}
        </div>
      </section>`;

const trailerItems = [
  {
    title: "God of War Laufey - Official Gameplay Reveal",
    meta: "PS5 - State of Play - PlayStation oficial",
    videoId: "HLMX2w3cwuE",
  },
  {
    title: "Until Dawn 2 - Announce Trailer",
    meta: "PS5 - State of Play - PlayStation oficial",
    videoId: "QpVZ9OvRLZI",
  },
  {
    title: "Control Resonant - Story/Release Date Reveal Trailer",
    meta: "PS5 - State of Play - PlayStation oficial",
    videoId: "TAzxTMaA6j4",
  },
  {
    title: "Ace Combat 8: Wings of Theve - Release Date Trailer",
    meta: "PS5 - State of Play - PlayStation oficial",
    videoId: "c2bgoQhlzqE",
  },
  {
    title: "Marathon - Season 2 Gameplay Trailer",
    meta: "PS5 y PC - State of Play - PlayStation oficial",
    videoId: "-WVhTcByDyY",
  },
  {
    title: "ILL - Story Trailer",
    meta: "PS5 - State of Play - PlayStation oficial",
    videoId: "TFHcVsPNbsY",
  },
];

const trailerSection = `<section class="trailer-strip" id="trailers">
        <div class="section-heading">
          <h2>Trailers oficiales PS5</h2>
          <p>Videos oficiales publicados tras el State of Play del 2 de junio.</p>
        </div>
        <div class="trailer-grid">
          ${trailerItems
            .map(
              (item) => `<a class="trailer-card" href="https://www.youtube.com/watch?v=${item.videoId}" target="_blank" rel="noopener">
            <span class="trailer-thumb">
              <img src="https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg" alt="" loading="lazy" />
              <span class="play-badge" aria-hidden="true"></span>
            </span>
            <span class="trailer-copy"><strong>${item.title}</strong><small>${item.meta}</small></span>
          </a>`
            )
            .join("\n          ")}
        </div>
      </section>`;

const statePoll = `<section class="state-poll" aria-labelledby="state-poll-title" data-poll="state-of-play-junio-2026">
        <div class="poll-copy">
          <span class="label">Encuesta</span>
          <h2 id="state-poll-title">Que anuncio del State of Play te dejo con mas ganas?</h2>
          <p>Vota y mira como queda el pulso de la comunidad BluePoint en esta portada.</p>
        </div>
        <form class="poll-form" data-poll-form>
          <button type="button" data-poll-option="god-of-war-laufey"><span>God of War Laufey</span><b data-poll-count>0%</b></button>
          <button type="button" data-poll-option="wolverine"><span>Marvel's Wolverine</span><b data-poll-count>0%</b></button>
          <button type="button" data-poll-option="until-dawn-2"><span>Until Dawn 2</span><b data-poll-count>0%</b></button>
          <button type="button" data-poll-option="control-resonant"><span>Control Resonant</span><b data-poll-count>0%</b></button>
        </form>
        <p class="poll-status" data-poll-status>Vota para desbloquear los resultados.</p>
      </section>`;

const commandCenter = `<section class="command-center" aria-labelledby="command-center-title">
        <div class="section-heading">
          <h2 id="command-center-title">Centro de mando PlayStation</h2>
          <p>Busca, prioriza y sigue lo importante del ecosistema PS5 sin perder tiempo.</p>
        </div>
        <div class="command-grid">
          <div class="search-console">
            <span class="label">Radar</span>
            <h3>Encuentra noticias por juego, servicio o estudio</h3>
            <label class="sr-only" for="news-search">Buscar noticias PlayStation</label>
            <input id="news-search" data-news-search type="search" placeholder="Buscar Wolverine, PS Plus, State of Play..." />
            <p data-search-status>Mostrando la seleccion editorial de portada.</p>
          </div>
          <div class="pulse-card">
            <strong>6</strong>
            <span>Novedades fuertes del State of Play</span>
          </div>
          <div class="pulse-card">
            <strong>3</strong>
            <span>Juegos mensuales de PS Plus en seguimiento</span>
          </div>
          <div class="pulse-card">
            <strong>2</strong>
            <span>Rumores bajo vigilancia editorial</span>
          </div>
        </div>
      </section>`;

const intelligenceHub = `<section class="intelligence-hub" aria-label="Herramientas editoriales BluePoint">
        <article class="intel-card release-card">
          <span class="label">Calendario</span>
          <h2>Proximos hitos PS5</h2>
          <ol class="release-list">
            <li><time datetime="2026-09-15">15 SEP</time><span><strong>Marvel's Wolverine</strong><small>Lanzamiento confirmado para PS5.</small></span></li>
            <li><time datetime="2026-09-24">24 SEP</time><span><strong>Control Resonant</strong><small>Fecha revelada tras State of Play.</small></span></li>
            <li><time datetime="2026-10-02">02 OCT</time><span><strong>Ace Combat 8</strong><small>Despegue de Wings of Theve en PS5.</small></span></li>
            <li><time datetime="2027">2027</time><span><strong>Until Dawn 2</strong><small>Terror de decisiones para el ano que viene.</small></span></li>
          </ol>
        </article>
        <article class="intel-card plus-card">
          <span class="label">PS Plus</span>
          <h2>Tracker mensual</h2>
          <div class="plus-stack">
            <span>Grounded Fully Yoked Edition</span>
            <span>Warhammer 40,000: Darktide</span>
            <span>Nickelodeon All-Star Brawl 2</span>
          </div>
          <p>Disponible del 2 de junio al 6 de julio. Buen bloque para enlazar guias y comparativas cuando se publiquen.</p>
        </article>
        <article class="intel-card rumor-card">
          <span class="label">Rumores</span>
          <h2>Semaforo de confianza</h2>
          <div class="rumor-meter"><span style="--meter: 64%"></span></div>
          <p>BluePoint separa rumores, reportes y confirmaciones para que el lector sepa cuando esperar y cuando solo vigilar.</p>
          <a href="./rumores.html">Ver radar de rumores -&gt;</a>
        </article>
      </section>`;

const growthPanel = `<section class="growth-panel" aria-label="Compartir y comunidad">
        <div class="share-card">
          <span class="label">Compartir</span>
          <h2>Ayuda a que BluePoint llegue a mas jugadores</h2>
          <p>Comparte la cobertura del State of Play y trae mas votos a la encuesta.</p>
          <div class="share-actions">
            <button type="button" data-share="native">Compartir</button>
            <a data-share-x href="https://twitter.com/intent/tweet?text=BluePoint%20resume%20lo%20mejor%20del%20State%20of%20Play%20para%20PS5&hashtags=PlayStation,PS5,StateOfPlay" target="_blank" rel="noopener">X</a>
            <button type="button" data-copy-link>Copiar enlace</button>
          </div>
          <small data-share-status>Listo para compartir.</small>
        </div>
        <div class="deal-card">
          <span class="label">Ofertas</span>
          <h2>Accesos utiles para jugadores PS5</h2>
          <p>Bloque preparado para monetizacion por afiliacion o acuerdos patrocinados.</p>
          <div class="deal-list">
            <a href="https://www.playstation.com/ps-plus/" target="_blank" rel="sponsored noopener"><strong>PlayStation Plus</strong><small>Catalogo, Essential, Extra y Premium</small></a>
            <a href="https://direct.playstation.com/" target="_blank" rel="sponsored noopener"><strong>PlayStation Direct</strong><small>Consolas, mandos y accesorios oficiales</small></a>
            <a href="https://store.playstation.com/" target="_blank" rel="sponsored noopener"><strong>PS Store</strong><small>Lanzamientos, reservas y rebajas digitales</small></a>
          </div>
          <small>Algunos enlaces pueden convertirse en afiliados cuando se active el programa.</small>
        </div>
      </section>`;

const sponsorPanel = `<section class="sponsor-panel" aria-label="Espacio patrocinado">
        <div>
          <span>Espacio patrocinado</span>
          <strong>Zona lista para acuerdos: tiendas, accesorios PS5, sillas, monitores o tarjetas PSN.</strong>
        </div>
        <a href="mailto:contacto@bluepoint.local?subject=Patrocinio%20BluePoint">Contactar</a>
      </section>`;

const home = `${head("BluePoint")}
  <body data-group="playstation">
    ${nav("Inicio")}
    <main class="page-shell">
      <section class="ticker" aria-label="Ultima hora" data-news-ticker>
        <strong><span aria-hidden="true">BP</span> Ultima hora</strong>
        <span>State of Play</span>
        <span>PS Plus</span>
        <span>Exclusivos PS5</span>
      </section>

      <section class="top-grid" id="noticias">
        <article class="hero-panel playstation-hero">
          <div class="hero-copy">
            <div class="chips" aria-label="Categorias">
              <span>PS5</span>
              <span>PS Plus</span>
              <span>State of Play</span>
            </div>
            <h1>Actualidad PlayStation con pulso propio</h1>
            <p>BluePoint sigue PS5, PlayStation Studios, State of Play, PS Plus, exclusivos, rumores y guias con contexto claro para jugadores.</p>
            <div class="hero-actions">
              <a class="primary-btn" href="#destacadas">Ver noticias <span aria-hidden="true">&gt;</span></a>
              <a class="ghost-btn" href="./state-of-play.html">State of Play</a>
            </div>
          </div>
        </article>

        <aside class="now-panel" aria-label="Ahora mismo" data-news-now></aside>
      </section>

      ${commandCenter}

      <section class="platforms" id="secciones">
        <div class="section-heading">
          <h2>Secciones PlayStation</h2>
          <p>Accesos directos a las areas clave del ecosistema PlayStation.</p>
        </div>
        <div class="platform-grid">
          <a class="platform-card play" href="./state-of-play.html"><span class="platform-icon">${sectionIcon("state")}</span><span><strong>State of Play</strong><small>Eventos, anuncios, trailers y gameplay mostrados por Sony.</small><b>Ver State of Play -&gt;</b></span></a>
          <a class="platform-card play" href="./playstation.html"><span class="platform-icon">${sectionIcon("ps5")}</span><span><strong>Noticias PS5</strong><small>Actualidad diaria de PS5, PlayStation Studios y accesorios.</small><b>Ver noticias -&gt;</b></span></a>
          <a class="platform-card play" href="./ps-plus.html"><span class="platform-icon">${sectionIcon("plus")}</span><span><strong>PS Plus</strong><small>Juegos mensuales, catalogo, Extra, Premium y rotaciones.</small><b>Ver PS Plus -&gt;</b></span></a>
          <a class="platform-card play" href="./exclusivos.html"><span class="platform-icon">${sectionIcon("exclusive")}</span><span><strong>Exclusivos</strong><small>Grandes juegos first party y acuerdos clave de PlayStation.</small><b>Ver exclusivos -&gt;</b></span></a>
          <a class="platform-card play" href="./rumores.html"><span class="platform-icon">${sectionIcon("rumor")}</span><span><strong>Rumores</strong><small>Filtraciones, pistas y senales con lectura prudente.</small><b>Ver rumores -&gt;</b></span></a>
          <a class="platform-card play" href="./guias.html"><span class="platform-icon">${sectionIcon("guide")}</span><span><strong>Guias</strong><small>Consejos y claves practicas para jugadores de PS5.</small><b>Ver guias -&gt;</b></span></a>
          <a class="platform-card play" href="./calendario.html"><span class="platform-icon">${sectionIcon("state")}</span><span><strong>Calendario PS5</strong><small>Fechas, reservas, betas, demos y eventos importantes.</small><b>Ver calendario -&gt;</b></span></a>
          <a class="platform-card play" href="./ofertas.html"><span class="platform-icon">${sectionIcon("guide")}</span><span><strong>Ofertas PS Store</strong><small>Rebajas, reservas, accesorios y oportunidades monetizables.</small><b>Ver ofertas -&gt;</b></span></a>
          <a class="platform-card play" href="./juegos.html"><span class="platform-icon">${sectionIcon("exclusive")}</span><span><strong>Fichas de juegos</strong><small>Saros, Wolverine, Intergalactic y hubs vivos por juego.</small><b>Ver juegos -&gt;</b></span></a>
          <a class="platform-card play" href="./estudios.html"><span class="platform-icon">${sectionIcon("ps5")}</span><span><strong>Radar de estudios</strong><small>Insomniac, Housemarque, Naughty Dog, Santa Monica y mas.</small><b>Ver estudios -&gt;</b></span></a>
        </div>
      </section>

      <section class="featured" id="destacadas">
        <div class="section-heading">
          <h2>Ultimas noticias PlayStation</h2>
          <p>La actualidad mas relevante del ecosistema PlayStation.</p>
        </div>
        <div class="news-grid" data-news-grid></div>
      </section>

      ${statePoll}

      ${intelligenceHub}

      ${trailerSection}

      ${growthPanel}

      ${sponsorPanel}

      <section class="newsletter" aria-label="Suscripcion">
        <div class="mail-icon" aria-hidden="true">@</div>
        <div><h2>Recibe lo mejor de <span>BluePoint</span></h2><p>Actualidad PlayStation, PS Plus, State of Play y exclusivos.</p></div>
        <form><label class="sr-only" for="email">Tu correo electronico</label><input id="email" type="email" placeholder="Tu correo electronico" /><button type="submit">Suscribirme</button><small>No enviamos spam. Puedes darte de baja cuando quieras.</small></form>
      </section>
    </main>
  </body>
</html>
`;

fs.writeFileSync("index.html", home, "utf8");

sectionPage({
  file: "playstation.html",
  title: "Noticias PS5",
  active: "Noticias PS5",
  bodyAttr: 'data-category="PlayStation"',
  label: "PlayStation",
  heading: "Noticias PS5",
  copy: "Actualidad de PS5, PlayStation Studios, PS Plus, accesorios y proximos lanzamientos.",
  icon: "ps5",
});

sectionPage({
  file: "state-of-play.html",
  title: "State of Play",
  active: "State of Play",
  bodyAttr: 'data-section="state-of-play"',
  label: "State of Play",
  heading: "Eventos PlayStation",
  copy: "Anuncios, trailers, gameplay y claves de cada presentacion de Sony.",
  icon: "state",
});

sectionPage({
  file: "ps-plus.html",
  title: "PS Plus",
  active: "PS Plus",
  bodyAttr: 'data-section="ps-plus"',
  label: "PS Plus",
  heading: "PlayStation Plus",
  copy: "Juegos mensuales, catalogo Extra y Premium, rotaciones y servicios.",
  icon: "plus",
});

sectionPage({
  file: "exclusivos.html",
  title: "Exclusivos",
  active: "Exclusivos",
  bodyAttr: 'data-section="exclusivos"',
  label: "Exclusivos",
  heading: "Exclusivos PlayStation",
  copy: "PlayStation Studios, acuerdos third party, PS5 y grandes nombres del catalogo.",
  icon: "exclusive",
});

sectionPage({
  file: "rumores.html",
  title: "Rumores",
  active: "Rumores",
  bodyAttr: 'data-section="rumores"',
  label: "Rumores",
  heading: "Rumores PlayStation",
  copy: "Filtraciones y pistas tratadas con prudencia, contexto y nivel de confianza.",
  icon: "rumor",
});

sectionPage({
  file: "guias.html",
  title: "Guias",
  active: "Guias",
  bodyAttr: 'data-section="guias"',
  label: "Guias",
  heading: "Guias PlayStation",
  copy: "Consejos, explicaciones y claves practicas para jugadores de PS5.",
  icon: "guide",
});

resourcePage({
  file: "calendario.html",
  title: "Calendario PS5",
  active: "Calendario",
  label: "Calendario",
  heading: "Calendario PS5",
  copy: "Fechas de salida, reservas, betas, demos y eventos para que el lector vuelva cada semana.",
  icon: "state",
  content: calendarContent,
});

resourcePage({
  file: "rumorometro.html",
  title: "Rumorometro",
  active: "Rumores",
  label: "Rumores",
  heading: "Rumorometro PlayStation",
  copy: "Una capa visual para medir confianza, separar filtracion de confirmacion y mover conversacion.",
  icon: "rumor",
  content: rumorometerContent,
});

resourcePage({
  file: "ofertas.html",
  title: "Ofertas PS Store",
  active: "PS Plus",
  label: "Ofertas",
  heading: "Ofertas PS Store",
  copy: "Radar de rebajas, reservas, accesorios y enlaces preparados para monetizacion futura.",
  icon: "guide",
  content: dealsContent,
});

resourcePage({
  file: "juegos.html",
  title: "Fichas de juegos",
  active: "Juegos",
  label: "Juegos",
  heading: "Fichas de juegos PlayStation",
  copy: "Hubs vivos para los juegos que mas busquedas y conversacion pueden traer a BluePoint.",
  icon: "exclusive",
  content: gamesContent,
});

resourcePage({
  file: "estudios.html",
  title: "Radar de estudios",
  active: "Juegos",
  label: "Estudios",
  heading: "Radar de estudios PlayStation",
  copy: "Seguimiento de estudios first party y socios clave para anticipar noticias importantes.",
  icon: "ps5",
  content: studiosContent,
});

["videojuegos.html", "xbox.html", "nintendo.html", "pc.html", "cine.html", "series.html"].forEach((file) => {
  if (fs.existsSync(file)) {
    const redirect = `${head("BluePoint")}
  <body data-category="PlayStation">
    ${nav("Noticias PS5")}
    <main class="page-shell">
      <section class="section-hero play-theme">
        <div><span class="label">BluePoint</span><h1>BluePoint ahora es PlayStation</h1><p>Esta seccion se ha integrado en la nueva cobertura centrada en PS5.</p></div>
        <div class="section-logo">${sectionIcon("ps5")}</div>
      </section>
      <section class="section-layout news-only"><div class="article-stack" data-news-list></div></section>
    </main>
  </body>
</html>
`;
    fs.writeFileSync(file, redirect, "utf8");
  }
});
