// Renueva el acceso cuando vence (cada ~6 h).
const {missing, token} = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({error: "Usa POST"});
  if (missing()) return res.status(500).json({error: "Falta configurar Strava en Vercel."});
  const rt = (req.body && req.body.refresh_token) || "";
  if (!rt) return res.status(400).json({error: "Falta refresh_token"});
  try { res.status(200).json(await token({refresh_token: rt, grant_type: "refresh_token"})); }
  catch (e) { res.status(401).json({error: e.message}); }
};
