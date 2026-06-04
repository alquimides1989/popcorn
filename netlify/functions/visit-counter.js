const { getStore } = require("@netlify/blobs");

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const response = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return response(204, {});
  if (event.httpMethod !== "POST") return response(405, { message: "Metodo no permitido." });

  try {
    const store = getStore("bluepoint-visits");
    const current = (await store.get("total", { type: "json" })) || { count: 0 };
    const count = Number(current.count || 0) + 1;
    await store.setJSON("total", {
      count,
      updatedAt: new Date().toISOString(),
    });

    return response(200, { count });
  } catch {
    return response(500, { message: "No se ha podido actualizar el contador." });
  }
};
