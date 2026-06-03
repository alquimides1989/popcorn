const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": process.env.NEWSLETTER_ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const response = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return response(204, {});
  }

  if (event.httpMethod !== "POST") {
    return response(405, { message: "Metodo no permitido." });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isFinite(listId)) {
    return response(500, { message: "Falta configurar BREVO_API_KEY o BREVO_LIST_ID." });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const email = String(body.email || "").trim().toLowerCase();
    const segments = Array.isArray(body.segments) ? body.segments.filter(Boolean).slice(0, 8) : [];
    const source = String(body.source || "bluepoint-web").slice(0, 80);

    if (!isEmail(email)) {
      return response(400, { message: "El correo no parece valido." });
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
      return response(brevoResponse.status, {
        message: brevoBody.message || "Brevo ha rechazado el alta.",
      });
    }

    return response(200, { message: "Suscripcion activada. Gracias por unirte a BluePoint." });
  } catch (error) {
    return response(500, { message: "No se ha podido procesar la suscripcion." });
  }
};
