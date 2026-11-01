// Logika rezervací. Nezávisí na Netlify, takže se dá otestovat samostatně.
// `store` je objekt s metodami list, get, setJSON a delete (stejné jako Netlify Blobs).

const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const TOKEN_RE = /^[A-Za-z0-9_-]{8,80}$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function handle(req, store) {
  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "r/" });
    const reservations = {};
    await Promise.all(
      blobs.map(async (b) => {
        const v = await store.get(b.key, { type: "json", consistency: "strong" });
        // Token se nikdy neposílá ven, jen jméno.
        if (v && v.by) reservations[b.key.slice(2)] = { by: v.by };
      })
    );
    return json({ reservations });
  }

  if (req.method !== "POST") return json({ error: "method" }, 405);

  const text = await req.text();
  if (text.length > 2000) return json({ error: "too_large" }, 413);

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad_json" }, 400);
  }

  const { action, id, name, token } = body || {};
  if (typeof id !== "string" || !ID_RE.test(id)) return json({ error: "bad_id" }, 400);
  if (typeof token !== "string" || !TOKEN_RE.test(token)) return json({ error: "bad_token" }, 400);
  const key = "r/" + id;

  if (action === "reserve") {
    const clean = String(name || "").trim().replace(/\s+/g, " ").slice(0, 40);
    if (!clean) return json({ error: "no_name" }, 400);
    // onlyIfNew: zápis projde jen tehdy, když dárek ještě nikdo nerezervoval.
    const { modified } = await store.setJSON(
      key,
      { by: clean, token, at: Date.now() },
      { onlyIfNew: true }
    );
    if (!modified) return json({ error: "taken" }, 409);
    return json({ ok: true, by: clean });
  }

  if (action === "cancel") {
    const current = await store.get(key, { type: "json", consistency: "strong" });
    if (!current) return json({ ok: true });
    if (current.token !== token) return json({ error: "not_yours" }, 403);
    await store.delete(key);
    return json({ ok: true });
  }

  return json({ error: "bad_action" }, 400);
}
