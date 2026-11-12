// Paso 1: envía al usuario a Strava para autorizar la lectura de actividades.
const {base, missing} = require("./_lib");
module.exports = (req, res) => {
  if (missing()) return res.status(500).send("Falta configurar STRAVA_CLIENT_ID y STRAVA_CLIENT_SECRET en Vercel.");
  const u = new URL("https://www.strava.com/oauth/mobile/authorize");
  u.search = new URLSearchParams({client_id: process.env.STRAVA_CLIENT_ID, redirect_uri: `${base(req)}/api/strava/callback`,
    response_type: "code", approval_prompt: "auto", scope: "read,activity:read_all"}).toString();
  res.writeHead(302, {Location: u.toString()}); res.end();
};
