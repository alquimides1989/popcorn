const fs = require("node:fs");

const scriptVersion = "7";

const head = (title) => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title === "BluePoint" ? "BluePoint" : `${title} | BluePoint`}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="icon" href="./assets/bluepoint-logo.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="./styles.css" />
    <script src="./noticias.js?v=${scriptVersion}" defer></script>
  </head>`;

const sectionIcon = (name) => `<span class="section-icon ${name}-icon" aria-hidden="true"></span>`;

const nav = (active) => {
  const items = [
    ["Inicio", "index.html"],
    ["Noticias PS5", "playstation.html"],
    ["State of Play", "state-of-play.html"],
    ["PS Plus", "ps-plus.html"],
    ["Exclusivos", "exclusivos.html"],
    ["Rumores", "rumores.html"],
    ["Guias", "guias.html"],
  ];

  return `<header class="site-header">
      <a class="brand bluepoint-brand" href="./index.html" aria-label="BluePoint">
        <span class="brand-line"><span class="cyan">Blue</span><span class="gold">Point</span></span>
        <span class="tagline">PS5 · PS Plus · Exclusivos</span>
      </a>
      <nav class="nav" aria-label="Principal">
        ${items.map(([label, href]) => `<a${label === active ? ' class="active"' : ""} href="./${href}">${label}</a>`).join("\n        ")}
      </nav>
      <a class="learn" href="./playstation.html">Noticias <span aria-hidden="true">›</span></a>
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

const home = `${head("BluePoint")}
  <body data-group="playstation">
    ${nav("Inicio")}
    <main class="page-shell">
      <section class="ticker" aria-label="Ultima hora" data-news-ticker>
        <strong><span aria-hidden="true">⚡</span> Ultima hora</strong>
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
              <a class="primary-btn" href="#destacadas">Ver noticias <span aria-hidden="true">›</span></a>
              <a class="ghost-btn" href="./state-of-play.html">State of Play</a>
            </div>
          </div>
        </article>

        <aside class="now-panel" aria-label="Ahora mismo" data-news-now></aside>
      </section>

      <section class="platforms" id="secciones">
        <div class="section-heading">
          <h2>Secciones PlayStation</h2>
          <p>Accesos directos a las areas clave del ecosistema PlayStation.</p>
        </div>
        <div class="platform-grid">
          <a class="platform-card play" href="./state-of-play.html"><span class="platform-icon">${sectionIcon("state")}</span><span><strong>State of Play</strong><small>Eventos, anuncios, trailers y gameplay mostrados por Sony.</small><b>Ver State of Play →</b></span></a>
          <a class="platform-card play" href="./playstation.html"><span class="platform-icon">${sectionIcon("ps5")}</span><span><strong>Noticias PS5</strong><small>Actualidad diaria de PS5, PlayStation Studios y accesorios.</small><b>Ver noticias →</b></span></a>
          <a class="platform-card play" href="./ps-plus.html"><span class="platform-icon">${sectionIcon("plus")}</span><span><strong>PS Plus</strong><small>Juegos mensuales, catalogo, Extra, Premium y rotaciones.</small><b>Ver PS Plus →</b></span></a>
          <a class="platform-card play" href="./exclusivos.html"><span class="platform-icon">${sectionIcon("exclusive")}</span><span><strong>Exclusivos</strong><small>Grandes juegos first party y acuerdos clave de PlayStation.</small><b>Ver exclusivos →</b></span></a>
          <a class="platform-card play" href="./rumores.html"><span class="platform-icon">${sectionIcon("rumor")}</span><span><strong>Rumores</strong><small>Filtraciones, pistas y senales con lectura prudente.</small><b>Ver rumores →</b></span></a>
          <a class="platform-card play" href="./guias.html"><span class="platform-icon">${sectionIcon("guide")}</span><span><strong>Guias</strong><small>Consejos y claves practicas para jugadores de PS5.</small><b>Ver guias →</b></span></a>
        </div>
      </section>

      <section class="featured" id="destacadas">
        <div class="section-heading">
          <h2>Ultimas noticias PlayStation</h2>
          <p>La actualidad mas relevante del ecosistema PlayStation.</p>
        </div>
        <div class="news-grid" data-news-grid></div>
      </section>

      <section class="newsletter" aria-label="Suscripcion">
        <div class="mail-icon" aria-hidden="true">✉</div>
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
