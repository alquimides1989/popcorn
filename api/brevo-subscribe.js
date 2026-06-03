const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

const json = (res, statusCode, body) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", process.env.NEWSLETTER_ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(body));
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { message: "Metodo no permitido." });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isFinite(listId)) {
    json(res, 500, { message: "Falta configurar BREVO_API_KEY o BREVO_LIST_ID." });
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    const email = String(body.email || "").trim().toLowerCase();
    const segments = Array.isArray(body.segments) ? body.segments.filter(Boolean).slice(0, 8) : [];
    const source = String(body.source || "bluepoint-web").slice(0, 80);

    if (!isEmail(email)) {
      json(res, 400, { message: "El correo no parece valido." });
      return;
    }

    const attributes = {};
    if (process.env.BREVO_SOURCE_ATTRIBUTE) {
      attributes[process.env.BREVO_SOURCE_ATTRIBUTE] = source;
    }
    if (process.env.BREVO_SEGMENTS_ATTRIBUTE && segments.length) {
      attributes[process.env.BREVO_SEGMENTS_ATTRIBUTE] = segments.join(", ");
    }

    const payload = {
      email,
      listIds: [listId],
      updateEnabled: true,
    };

    if (Object.keys(attributes).length) {
      payload.attributes = attributes;
    }

    const brevoResponse = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const brevoBody = await brevoResponse.json().catch(() => ({}));

    if (!brevoResponse.ok) {
      json(res, brevoResponse.status, {
        message: brevoBody.message || "Brevo ha rechazado el alta.",
      });
      return;
    }

    json(res, 200, { message: "Suscripcion activada. Gracias por unirte a BluePoint." });
  } catch (error) {
    json(res, 500, { message: "No se ha podido procesar la suscripcion." });
  }
};
