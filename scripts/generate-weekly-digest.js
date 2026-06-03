const fs = require("node:fs");

const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

const news = readJson("data/noticias.json", { items: [] }).items || [];
const engagement = readJson("data/engagement-sections.json", { calendar: [], deals: [], rumorMeter: [] });

const sortedNews = [...news]
  .filter((item) => item.category === "PlayStation")
  .sort((a, b) => new Date(b.publishedAt || b.detectedAt || 0) - new Date(a.publishedAt || a.detectedAt || 0))
  .slice(0, 5);

const upcoming = [...(engagement.calendar || [])]
  .filter((item) => new Date(item.date).getTime() >= Date.now() || item.label === "Q4")
  .slice(0, 4);

const deals = (engagement.deals || []).slice(0, 3);
const rumors = (engagement.rumorMeter || []).slice(0, 2);

const newsRows = sortedNews
  .map(
    (item) => `<tr>
      <td style="padding:14px 0;border-bottom:1px solid #1a3154;">
        <p style="margin:0 0 6px;color:#25d7ff;font-size:12px;font-weight:700;text-transform:uppercase;">${escapeHtml(item.source || "BluePoint")}</p>
        <h3 style="margin:0 0 8px;color:#ffffff;font-size:18px;line-height:1.2;">${escapeHtml(item.title)}</h3>
        <p style="margin:0;color:#cddaf0;font-size:14px;line-height:1.55;">${escapeHtml(item.summary)}</p>
      </td>
    </tr>`
  )
  .join("");

const calendarRows = upcoming
  .map(
    (item) => `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #1a3154;">
        <strong style="display:inline-block;min-width:72px;color:#25d7ff;">${escapeHtml(item.label)}</strong>
        <span style="color:#ffffff;font-weight:700;">${escapeHtml(item.title)}</span>
        <p style="margin:4px 0 0 72px;color:#9fb1cf;font-size:13px;line-height:1.45;">${escapeHtml(item.summary)}</p>
      </td>
    </tr>`
  )
  .join("");

const dealRows = deals
  .map(
    (item) => `<tr>
      <td style="padding:12px 0;border-bottom:1px solid #1a3154;">
        <p style="margin:0 0 5px;color:#25d7ff;font-size:12px;font-weight:700;">${escapeHtml(item.type)}</p>
        <strong style="display:block;color:#ffffff;font-size:16px;">${escapeHtml(item.title)}</strong>
        <p style="margin:6px 0 10px;color:#cddaf0;font-size:13px;line-height:1.5;">${escapeHtml(item.summary)}</p>
        <a href="${escapeHtml(item.url)}" style="color:#25d7ff;font-size:13px;font-weight:700;text-decoration:underline;">${escapeHtml(item.cta)}</a>
      </td>
    </tr>`
  )
  .join("");

const rumorRows = rumors
  .map(
    (item) => `<p style="margin:0 0 8px;color:#cddaf0;font-size:14px;line-height:1.5;"><strong style="color:#ffffff;">${escapeHtml(item.title)}:</strong> ${escapeHtml(item.summary)}</p>`
  )
  .join("");

const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Resumen semanal BluePoint</title>
  </head>
  <body style="margin:0;padding:0;background:#050912;color:#f4f8ff;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050912;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#08111f;border:1px solid #16355e;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:28px;background:#071529;border-bottom:1px solid #16355e;">
                <img src="https://bluepointesp.netlify.app/assets/bluepoint-wordmark-white.png" width="190" alt="BluePoint" style="display:block;border:0;max-width:190px;height:auto;margin:0 0 20px;">
                <p style="margin:0 0 10px;color:#25d7ff;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Resumen semanal</p>
                <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.1;">Lo importante de PlayStation, sin ruido</h1>
                <p style="margin:12px 0 0;color:#d8e5ff;font-size:15px;line-height:1.55;">Noticias, calendario, rumores y ofertas preparadas para la comunidad BluePoint.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px;">
                <h2 style="margin:0 0 10px;color:#ffffff;font-size:21px;">5 noticias clave</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${newsRows}</table>

                <h2 style="margin:28px 0 10px;color:#ffffff;font-size:21px;">Proximos hitos PS5</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${calendarRows}</table>

                <h2 style="margin:28px 0 10px;color:#ffffff;font-size:21px;">Radar de ofertas</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${dealRows}</table>

                <h2 style="margin:28px 0 10px;color:#ffffff;font-size:21px;">Rumores bajo vigilancia</h2>
                ${rumorRows || '<p style="margin:0;color:#cddaf0;font-size:14px;">Sin rumores destacados esta semana.</p>'}

                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px auto 4px;">
                  <tr>
                    <td align="center" style="border-radius:8px;background:#1b8cff;">
                      <a href="https://bluepointesp.netlify.app/" target="_blank" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;">Leer BluePoint</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 26px;background:#060b15;border-top:1px solid #16355e;">
                <p style="margin:0 0 8px;color:#8fa1bd;font-size:12px;line-height:1.5;">Has recibido este correo porque te has suscrito a la newsletter de BluePoint.</p>
                <p style="margin:0;color:#8fa1bd;font-size:12px;line-height:1.5;">Puedes darte de baja cuando quieras: <a href="{{ unsubscribe }}" style="color:#25d7ff;text-decoration:underline;">cancelar suscripcion</a>.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

fs.mkdirSync("emails", { recursive: true });
fs.writeFileSync("emails/resumen-semanal-bluepoint.html", html, "utf8");
console.log("emails/resumen-semanal-bluepoint.html");
