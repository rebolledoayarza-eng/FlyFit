// Utilidades compartidas para la conexión con Strava.
// El Client Secret vive solo en las variables de entorno de Vercel; nunca llega al navegador.
const base = req => `https://${req.headers["x-forwarded-host"] || req.headers.host}`;
const missing = () => !process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET;
async function token(params){
  const r = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(Object.assign({client_id: process.env.STRAVA_CLIENT_ID, client_secret: process.env.STRAVA_CLIENT_SECRET}, params))
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.message || `Strava respondió ${r.status}`);
  return {access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at,
    athlete: j.athlete ? [j.athlete.firstname, j.athlete.lastname].filter(Boolean).join(" ") : undefined};
}
module.exports = {base, missing, token};
